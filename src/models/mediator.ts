/* eslint-disable @typescript-eslint/ban-types */
import type { default as MediatorInterface } from "@/interfaces/imediator.js";
import type Notification from "@/models/notification.js";
import type { NotificationClass } from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import type RequestBase from "@/models/request.js";
import type PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import Dispatcher from "@/interfaces/idispatcher";
import Resolver from "@/interfaces/iresolver";
import RequestHandler from "@/interfaces/irequest.handler";
import { default as DispatcherImplementation } from "./dispatcher";
import { default as ResolverImplementation } from "./resolver";

/**
 * The mediator class
 * Send request and publish events
 *
 * @export
 * @class Mediator
 * @implements {Mediator}
 */
export default class Mediator implements MediatorInterface {
    private readonly _dispatcher: Dispatcher;
    private readonly _resolver: Resolver;

    public constructor(
        dispatcher?: Dispatcher,
        resolver?: Resolver
    ) {
        this._dispatcher = dispatcher || DispatcherImplementation.instance;
        this._resolver = resolver || ResolverImplementation.instance;
    }
    
    /**
     * Send a request to the mediator
     *
     * @template T
     * @param {RequestBase<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof Mediator
     */
    public async send<TResult>(request: RequestBase<TResult>): Promise<TResult> {
        const name = request.constructor.name;

        const handler = this._resolver.resolve<RequestHandler<RequestBase<TResult>, TResult>>(name);
        const behaviors = this._dispatcher.behaviors
            .getAll()
            .map(p => p.behavior);
        
        let currentBehaviorIndex = 0;
        const next = async (): Promise<TResult> => {
            if(currentBehaviorIndex < behaviors.length) {
                const behaviorClass = behaviors[currentBehaviorIndex];
                const behavior = this._resolver.resolve<PipelineBehavior>((behaviorClass as unknown as Function).name);
                currentBehaviorIndex++;
                return await behavior.handle(request, next) as Promise<TResult>;
            }
            else {
                return await handler.handle(request);
            }
        };

        return await next();
    }

    /**
     * Publish a new message
     *
     * @param {Notification} message The message to publish
     * @returns {Promise<void>}
     * @memberof Mediator
     */
    public async publish(message: Notification): Promise<void> {
        const events = this._dispatcher.notifications.getAll(message.constructor as NotificationClass);

        await Promise.all(events.map(async (p) => {
            const handler = this._resolver.resolve<NotificationHandler<Notification>>((p.handler as unknown as Function).name);
            return handler.handle(message);
        }));
    }
}

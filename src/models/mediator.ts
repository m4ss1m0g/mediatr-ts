/* eslint-disable @typescript-eslint/ban-types */
import type Notification from "@/models/notification.js";
import type { NotificationClass } from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import type RequestBase from "@/models/request.js";
import type PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import Resolver, { Class } from "@/interfaces/iresolver";
import RequestHandler from "@/interfaces/irequest.handler";
import { typeMappings } from "./mappings";
import { InstantiationResolver } from "./resolver";

type Settings = {
    resolver: Resolver;
}

/**
 * The mediator class
 * Send request and publish events
 *
 * @export
 * @class Mediator
 * @implements {Mediator}
 */
export default class Mediator {
    private readonly _resolver: Resolver;

    public get notifications(): OrderedNotificationsMapping {
        return typeMappings.notifications;
    }

    public get pipelineBehaviors(): OrderedPipelineBehaviorsMapping {
        return typeMappings.pipelineBehaviors;
    }

    public constructor(settings?: Settings) {
        const resolver = settings?.resolver || new InstantiationResolver();
        this._resolver = resolver;

        this.registerTypesInResolver(resolver);
    }

    private registerTypesInResolver(resolver: Resolver) {
        for (const mapping of typeMappings.notifications.getAll()) {
            resolver.add(mapping.handlerClass);
        }

        for (const mapping of typeMappings.requestHandlers.getAll()) {
            resolver.add(mapping.handlerClass);
        }

        for (const mapping of typeMappings.pipelineBehaviors.getAll()) {
            resolver.add(mapping.behaviorClass);
        }
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
        const handlerClasses = typeMappings.requestHandlers.getAll(request.constructor as Class<RequestBase<TResult>>);
        if(handlerClasses.length === 0) {
            throw new Error(`No handler found for request ${request.constructor.name}`);
        }

        const handler = this._resolver.resolve(handlerClasses[0].handlerClass as unknown as Class<RequestHandler<RequestBase<TResult>, TResult>>);
        const behaviors = typeMappings.pipelineBehaviors
            .getAll()
            .map(p => p.behaviorClass);
        
        let currentBehaviorIndex = 0;
        const next = async () => {
            if(currentBehaviorIndex < behaviors.length) {
                const behaviorClass = behaviors[currentBehaviorIndex];
                const behavior = this._resolver.resolve(behaviorClass as unknown as Class<PipelineBehavior>);
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
        const events = typeMappings.notifications.getAll(message.constructor as NotificationClass);

        await Promise.all(events.map(async (p) => {
            const handler = this._resolver.resolve(p.handlerClass as unknown as Class<NotificationHandler<Notification>>);
            return handler.handle(message);
        }));
    }
}

type OrderedNotificationsMapping = Pick<typeof typeMappings.notifications, 'setOrder'>;
type OrderedPipelineBehaviorsMapping = Pick<typeof typeMappings.pipelineBehaviors, 'setOrder'>;
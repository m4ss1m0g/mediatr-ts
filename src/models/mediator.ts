/* eslint-disable @typescript-eslint/ban-types */
import type Notification from "@/models/notification.js";
import type { NotificationClass } from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import type RequestBase from "@/models/request.js";
import type PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import Resolver, { Class } from "@/interfaces/iresolver";
import RequestHandler from "@/interfaces/irequest.handler";
import { typeMappings } from "./mappings/index.js";
import { InstantiationResolver } from "./resolver";

type Settings = {
    resolver: Resolver;
}

/**
 * The mediator class.
 * Sends request and publishes events.
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
     * Send a request to the mediator.
     *
     * @template T
     * @param {RequestBase<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof Mediator
     */
    public async send<TResult>(request: RequestBase<TResult>): Promise<TResult> {
        const handler = this.getRequiredHandlerForRequest<TResult>(request);
        return this.wrapInPipelineBehaviorChainCalls<TResult>(
            async () => handler.handle(request),
            request, 
        );
    }

    /**
     * Wraps the given function in a chain of pipeline behavior calls.
     * On the deepest level, the action is called.
     * Then the chain of pipeline behaviors is called in reverse order on the result of that.
     */
    private async wrapInPipelineBehaviorChainCalls<TResult>(func: () => Promise<TResult>, request: RequestBase<TResult>) {
        let currentBehaviorIndex = 0;
        const behaviors = typeMappings.pipelineBehaviors.getAll();

        const getNextBehaviorInChain = () => {
            const behaviorClass = behaviors[currentBehaviorIndex++].behaviorClass;
            return this._resolver.resolve(behaviorClass as unknown as Class<PipelineBehavior>);
        };

        const next = async () => {
            const areMoreBehaviorsNeedingProcessing = currentBehaviorIndex < behaviors.length;
            if (areMoreBehaviorsNeedingProcessing) {
                const nextBehaviorInChain = getNextBehaviorInChain();
                return await nextBehaviorInChain.handle(request, next) as Promise<TResult>;
            }
            else {
                return await func();
            }
        };

        return await next();
    }

    private getRequiredHandlerForRequest<TResult>(request: RequestBase<TResult>) {
        const handlerClasses = typeMappings.requestHandlers.getAll(request.constructor as Class<RequestBase<TResult>>);
        if (handlerClasses.length === 0) {
            throw new Error(`No handler found for request ${request.constructor.name}`);
        }

        const handler = this._resolver.resolve(handlerClasses[0].handlerClass as unknown as Class<RequestHandler<RequestBase<TResult>, TResult>>);
        return handler;
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
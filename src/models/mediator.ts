/* eslint-disable @typescript-eslint/ban-types */
import type Notification from "@/models/notificationData.js";
import type { NotificationClass } from "@/models/notificationData.js";
import type NotificationHandler from "@/interfaces/notificationHandler.js";
import type RequestData from "@/models/requestData.js";
import type PipelineBehavior from "@/interfaces/pipelineBehavior.js";
import Resolver, { Class } from "@/interfaces/resolver.js";
import RequestHandler, { RequestHandlerClass } from "@/interfaces/requestHandler.js";
import { typeMappings } from "@/models/mappings/index.js";
import { InstantiationResolver } from "./instantiationResolver.js";
import PublishError from "@/errors/publish-error.js";
import { RequestDataClass } from "@/models/requestData.js";

type Settings = {
    resolver: Resolver;
};

/**
 * The mediator class.
 * Sends request and publishes events.
 *
 * @export
 * @class Mediator
 * @implements {Mediator}
 */
export default class Mediator {
    // The resolver
    private readonly _resolver: Resolver;

    /**
     * Gets the notifications.
     */
    public get notifications(): OrderedNotificationsMapping {
        return typeMappings.notifications;
    }

    /**
     * Gets the pipeline behaviors.
     */
    public get pipelineBehaviors(): OrderedPipelineBehaviorsMapping {
        return typeMappings.pipelineBehaviors;
    }

    /**
     * The constructor.
     * If custom settings are provided, it uses the resolver from those settings;
     * otherwise, it defaults to a new InstantiationResolver
     *
     * @param settings The custom settings
     */
    public constructor(settings?: Settings) {
        const resolver = settings?.resolver || new InstantiationResolver();
        this._resolver = resolver;

        this.registerTypesInResolver(resolver);
    }

    /**
     * This method registers types with a resolver.
     * If custom settings are provided, it uses the resolver from those settings;
     * otherwise, it defaults to a new InstantiationResolver where add method is not used
     *
     * @param resolver The resolver
     */
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
     * @param {RequestData<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof Mediator
     */
    public async send<TResult>(request: RequestData<TResult>): Promise<TResult> {
        const handler = this.getRequiredHandlerForRequest<TResult>(request);
        return this.wrapInPipelineBehaviorChainCalls<TResult>(
            async () => handler.handle(request),
            request
        );
    }

    /**
     * Wraps the given function in a chain of pipeline behavior calls.
     *
     * @param func The function to wrap
     * @param request The request to send
     * @returns The result of the action
     * @memberof Mediator
     * @private
     *
     */
    private async wrapInPipelineBehaviorChainCalls<TResult>(
        func: () => Promise<TResult>,
        request: RequestData<TResult>
    ) {
        let currentBehaviorIndex = 0;
        const behaviors = typeMappings.pipelineBehaviors.getAll();

        /**
         * Process the behavior in the chain
         */
        const execBehavior = async (
            request: RequestData<TResult>,
            next: () => Promise<unknown>
        ) => {
            const behaviorClass = behaviors[currentBehaviorIndex++].behaviorClass;
            const nextBehaviorInChain = this._resolver.resolve(
                behaviorClass as unknown as Class<PipelineBehavior>
            );
            return (await nextBehaviorInChain.handle(request, next)) as Promise<TResult>;
        };

        /**
         * Recursive function.
         * Process all behaviors in the pipeline, then the function and then the behavior in the reversed order
         */
        const next = async () => {
            const areMoreBehaviorsNeedingProcessing = currentBehaviorIndex < behaviors.length;
            if (areMoreBehaviorsNeedingProcessing) {
                return await execBehavior(request, next); // Process the behavior
            } else {
                return await func(); // Process the handler
            }
        };

        return await next();
    }

    /**
     * Get the handler for the given request
     *
     * @param {RequestData<TResult>} request The request
     * @returns {RequestHandler<RequestData<TResult>, TResult>} The handler
     * @private
     * @memberof Mediator
     */
    private getRequiredHandlerForRequest<TResult>(request: RequestData<TResult>) {
        const handlerClasses = typeMappings.requestHandlers.getAll(
            request.constructor as Class<RequestData<TResult>>
        );

        const handler = this._resolver.resolve(
            handlerClasses[0].handlerClass as unknown as Class<
                RequestHandler<RequestData<TResult>, TResult>
            >
        );
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

        const results = await Promise.allSettled(
            events.map(async (p) => {
                const handler = this._resolver.resolve(
                    p.handlerClass as unknown as Class<NotificationHandler<Notification>>
                );
                return handler.handle(message);
            })
        );

        if (results.some((r) => r.status === "rejected"))
            throw new PublishError("Error publishing notification", results);
    }


    /**
     * @description - Manually register a handler without {@requestHandler()} 
     * @type 
     * @param {RequestDataClass<TRequest>} request - request class
     * @param {RequestHandlerClass<RequestData<unknown>, unknown>} handler - request handler class
     * @memberof Mediator
     */
    public registerHandler<TRequest>(request: RequestDataClass<TRequest>, handler :RequestHandlerClass<RequestData<unknown>, unknown>) {

        const existingTypeMappings = typeMappings.requestHandlers.getAll().filter(x => x.requestClass === request);
        
        if(existingTypeMappings.length > 0) {
            throw new Error(`Request handler for ${request.name} has been defined twice. `);
        }
         // check if handler in resolver
        try {   this._resolver.resolve(handler) } catch (error) {
            // adds handler to resolver, since it wont added in constructing phase
            this._resolver.add(handler as RequestHandlerClass<RequestData<unknown>, unknown>)
          
        } 
        typeMappings.requestHandlers.add({
            requestClass: request,
            handlerClass: handler as RequestHandlerClass<RequestData<unknown>, unknown>
        });
    }
}

type OrderedNotificationsMapping = Pick<typeof typeMappings.notifications, "setOrder">;
type OrderedPipelineBehaviorsMapping = Pick<typeof typeMappings.pipelineBehaviors, "setOrder">;

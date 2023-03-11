/* eslint-disable @typescript-eslint/ban-types */
import type { IRequestHandler } from "@/index";
import type IMediator from "@/interfaces/imediator";
import type INotification from "@/interfaces/inotification";
import type { INotificationClass } from "@/interfaces/inotification";
import type INotificationHandler from "@/interfaces/inotification.handler";
import type IRequest from "@/interfaces/irequest";
import {mediatorSettings} from "@/index";
import type IPipelineBehavior from "@/interfaces/ipipeline.behavior";

/**
 * The mediator class
 * Send request and publish events
 *
 * @export
 * @class Mediator
 * @implements {IMediator}
 */
export default class Mediator implements IMediator {
    /**
     * Send a request to the mediator
     *
     * @template T
     * @param {IRequest<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof Mediator
     */
    public async send<T>(request: IRequest<T>): Promise<T> {
        const name = request.constructor.name;

        const handler = mediatorSettings.resolver.resolve<IRequestHandler<IRequest<T>, T>>(name);
        const behaviors = mediatorSettings.dispatcher.behaviors
            .getAll()
            .map(p => p.behavior);
        
        let currentBehaviorIndex = 0;
        const next = async (): Promise<T> => {
            if(currentBehaviorIndex < behaviors.length) {
                const behaviorClass = behaviors[currentBehaviorIndex];
                const behavior = mediatorSettings.resolver.resolve<IPipelineBehavior>((behaviorClass as unknown as Function).name);
                currentBehaviorIndex++;
                return await behavior.handle(request, next) as Promise<T>;
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
     * @param {INotification} message The message to publish
     * @returns {Promise<void>}
     * @memberof Mediator
     */
    public async publish(message: INotification): Promise<void> {
        const events = mediatorSettings.dispatcher.notifications.getAll(message.constructor as INotificationClass);

        await Promise.all(events.map(async (p) => {
            const handler = mediatorSettings.resolver.resolve<INotificationHandler<INotification>>((p.handler as unknown as Function).name);
            return handler.handle(message);
        }));
    }
}

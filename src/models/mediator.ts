import { IRequestHandler } from "@/index";
import IMediator from "@/interfaces/imediator";
import INotification from "@/interfaces/inotification";
import INotificationhandler from "@/interfaces/inotification.handler";
import IRequest from "@/interfaces/irequest";
import DispatchInstance from "@/models/dispatch.instance";
import settings from "@/settings";

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

        const handler = settings.resolver.resolve<IRequestHandler<IRequest<T>, T>>(name);
        return handler.handle(request);
    }

    /**
     * Publish a new message
     *
     * @param {INotification} message The message to publish
     * @returns {Promise<void>}
     * @memberof Mediator
     */
    public async publish(message: INotification): Promise<void[]> {
        const name = message.constructor.name;
        const events = settings.dispatcher.getAll(name);

        const e: Promise<void>[] = [];

        events.forEach(async (p: DispatchInstance) => {
            const handler = settings.resolver.resolve<INotificationhandler<INotification>>(p.handlerName);
            e.push(handler.handle(message));
        });

        return Promise.all(e);
    }
}

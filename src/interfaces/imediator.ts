import type INotification from "@/interfaces/inotification";
import type IRequest from "./irequest";

/**
 * The mediator interface
 *
 * @export
 * @interface IMediator
 */
export default interface IMediator {
    /**
     * Send a request to the mediator
     *
     * @template T
     * @param {IRequest<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof IMediator
     */
    send<T>(request: IRequest<T>): Promise<T>;

    /**
     * Publish a message to the mediator
     *
     * @param {INotification} message The message to publish
     * @returns {Promise<void>}
     * @memberof IMediator
     */
    publish(message: INotification): Promise<void>;
}

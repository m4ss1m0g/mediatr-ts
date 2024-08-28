import type Notification from "@/models/notification.js";
import type RequestBase from "@/models/request.js";

/**
 * The mediator interface
 *
 */
export default interface Mediator {
    /**
     * Send a request to the mediator
     *
     * @template T
     * @param {RequestBase<T>} request The request to send
     * @returns {Promise<T>}
     * @memberof IMediator
     */
    send<T>(request: RequestBase<T>): Promise<T>;

    /**
     * Publish a message to the mediator
     *
     * @param {Notification} message The message to publish
     * @returns {Promise<void>}
     * @memberof IMediator
     */
    publish(message: Notification): Promise<void>;
}

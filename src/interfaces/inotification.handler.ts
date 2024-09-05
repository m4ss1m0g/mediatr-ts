/**
 * The notification handler class
 * 
 * @exports
 * @interface NotificationHandler
 */
export default interface NotificationHandler<T> {
    /**
     * The notification handler called on T event
     *
     * @param {T} notification The notification param
     * @returns {Promise<void>}
     * @memberof INotificationHandler
     */
    handle(notification: T): Promise<void>;
}

export type NotificationHandlerClass<T> = new (...args: unknown[]) => NotificationHandler<T>;
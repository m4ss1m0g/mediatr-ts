/**
 * The notification handler class
 *
 * @export
 * @interface INotificationHandler
 * @template T
 */
export default interface INotificationHandler<T> {
    /**
     * The notification handler called on T event
     *
     * @param {T} notification The notification param
     * @returns {Promise<void>}
     * @memberof INotificationHandler
     */
    handle(notification: T): Promise<void>;
}

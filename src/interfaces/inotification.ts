/**
 * The Notification interface
 *
 * @export
 * @interface INotification
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface INotification {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor: Function;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type INotificationClass = new (...args: any[]) => INotification;
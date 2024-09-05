/**
 * The Notification interface
 *
 * @export
 * @interface NotificationData
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default class NotificationData {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotificationClass = new (...args: any[]) => NotificationData;
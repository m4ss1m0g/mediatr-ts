/**
 * The Notification interface
 *
 * @export
 * @interface NotificationData
 * @template T
 */

export default class NotificationData {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotificationClass = new (...args: any[]) => NotificationData;
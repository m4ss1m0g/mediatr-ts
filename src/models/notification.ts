const marker = Symbol();

/**
 * The Notification interface
 *
 * @export
 * @interface IRequest
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface,  @typescript-eslint/no-unused-vars
export default class NotificationBase {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotificationClass = new (...args: any[]) => NotificationBase;
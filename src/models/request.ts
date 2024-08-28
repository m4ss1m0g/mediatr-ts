const marker = Symbol();

/**
 *  The request interface
 *
 * @export
 * @interface IRequest
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface,  @typescript-eslint/no-unused-vars
export default class RequestBase<T> {
    [marker]: T = null!;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestClass<T> = new (...args: any[]) => RequestBase<T>;
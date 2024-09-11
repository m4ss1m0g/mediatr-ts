const marker = Symbol();

/**
 *  The request
 *
 * @export
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface,  @typescript-eslint/no-unused-vars
export default class RequestData<T = void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [marker]: T = null!; // It has there otherwise type inference doesn't work.
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestDataClass<T> = new (...args: any[]) => RequestData<T>;
/**
 *  The request interface
 *
 * @export
 * @interface IRequest
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface,  @typescript-eslint/no-unused-vars
export default interface IRequest<T> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor: Function;

    /**
     * The request explicit name, otherwise the class name
     */
    readonly uniqueId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IRequestClass<T> = new (...args: any[]) => IRequest<T>;
/**
 * THe Request Handler interface
 *
 * @export
 * @interface IRequestHandler
 * @template Input The input type
 * @template Output The output type
 */
export default interface IRequestHandler<Input, Output> {
    /**
     * Handle the request
     * @param value The request value
     */
    handle(value: Input): Promise<Output>;
}

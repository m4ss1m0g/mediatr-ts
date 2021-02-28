/**
 * The Request Handler interface
 *
 * @export
 * @interface IRequestHandler
 * @template Input The input type
 * @template Output The output type
 */
export default interface IRequestHandler<Input, Output> {
    /**
     * Handle the request
     *
     * @param {Input} value The request value
     * @returns {Promise<Output>}
     * @memberof IRequestHandler
     */
    handle(value: Input): Promise<Output>;
}

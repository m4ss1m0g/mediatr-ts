import type RequestBase from "../models/request";

/**
 * The Request Handler interface
 */
export default interface RequestHandler<TInput extends RequestBase<TOutput>, TOutput> {
    /**
     * Handle the request
     *
     * @param {TInput} value The request value
     * @returns {Promise<TOutput>}
     * @memberof IRequestHandler
     */
    handle(value: TInput): Promise<TOutput>;
}

import type RequestData from "../models/requestData.js";

/**
 * The Request Handler interface
 *
 * @exports
 * @interface RequestHandler
 */
export default interface RequestHandler<TInput extends RequestData<TOutput>, TOutput> {
    /**
     * Handle the request
     *
     * @param {TInput} value The request value
     * @returns {Promise<TOutput>}
     * @memberof IRequestHandler
     */
    handle(value: TInput): Promise<TOutput>;
}

export type RequestHandlerClass<TInput extends RequestData<TOutput>, TOutput> = new (...args: unknown[]) => RequestHandler<TInput, TOutput>;

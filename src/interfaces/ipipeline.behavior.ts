/**
 *  The pipeline behavior interface.
 *
 * @export
 * @interface IPipelineBehavior
 */

import type IRequest from "@/interfaces/irequest.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export default interface IPipelineBehavior {
    /**
     * The handle function
     * @param request The request
     * @param next The next function
     */
    handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown>;
}

export type IPipelineBehaviorClass = new (...args: unknown[]) => IPipelineBehavior;
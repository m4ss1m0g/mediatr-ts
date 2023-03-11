/**
 *  The pipeline behavior interface.
 *
 * @export
 * @interface IPipelineBehavior
 */

import type IRequest from "./irequest";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export default interface IPipelineBehavior {
    handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown>;
}

export type IPipelineBehaviorClass = new (...args: unknown[]) => IPipelineBehavior;
/**
 *  The pipeline behavior interface.
 *
 * @export
 * @interface IPipelineBehavior
 */

import type RequestBase from "@/models/request.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export default interface PipelineBehavior {
    handle(request: RequestBase<unknown>, next: () => unknown): Promise<unknown>;
}

export type PipelineBehaviorClass = new (...args: unknown[]) => PipelineBehavior;
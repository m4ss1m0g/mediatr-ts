import type RequestData from "@/models/requestData.js";

/**
 *  The pipeline behavior interface.
 * 
 * @param request The request to execute
 * @param next The next pipeline behavior
 *
 * @export
 * @interface PipelineBehavior
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export default interface PipelineBehavior {
    handle(request: RequestData<unknown>, next: () => unknown): Promise<unknown>;
}

export type PipelineBehaviorClass = new (...args: unknown[]) => PipelineBehavior;
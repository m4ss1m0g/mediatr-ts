import type RequestData from "@/models/request-data.js";

/**
 *  The pipeline behavior interface.
 *
 * @export
 * @interface PipelineBehavior
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export default interface PipelineBehavior {
    handle(request: RequestData<unknown>, next: () => unknown): Promise<unknown>;
}

export type PipelineBehaviorClass = new (...args: unknown[]) => PipelineBehavior;
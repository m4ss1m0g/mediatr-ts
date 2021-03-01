import DispatchInstance from "@/models/dispatch.instance";

/**
 * The dispatcher interface
 * Implement this interface and call mediatrSettings.dispatcher at startup
 * for changing the container and resolution of instances
 * 
 * @export
 * @interface IDispatcher
 */
export default interface IDispatcher {
    /**
     * Get all notification handlers order by order field for the specified event name
     *
     * @param {string} eventName The event name for which to get handlers
     * @returns {DispatchInstance[]}
     * @memberof IDispatcher
     */
    getAll(eventName: string): DispatchInstance[];

    /**
     * Add a dispatch instance to the container
     *
     * @param {DispatchInstance} instance The instance to add
     * @memberof IDispatcher
     */
    add(instance: DispatchInstance): void;

    /**
     * Remove all handlers for the specific event name
     *
     * @param {string} eventName The event for which remove the handlers
     * @memberof IDispatcher
     */
    remove(eventName: string): void;

    /**
     * Clear all instances from the container
     *
     * @memberof IDispatcher
     */
    clear(): void;
}

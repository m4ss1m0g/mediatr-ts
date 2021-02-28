/* eslint-disable @typescript-eslint/ban-types */

import IDispatcher from "@/interfaces/idispatcher";
import DispatchInstance from "@/models/dispatch.instance";

/**
 * Internal sort
 *
 * @param {DispatchInstance} a The a instance
 * @param {DispatchInstance} b The b instance
 * @returns {number}
 */
function byOrder(a: DispatchInstance, b: DispatchInstance): number {
    if (a.order < b.order) {
        return -1;
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
}

/**
 * The internal dispatcher
 * Here storing the mapping between the event name with the handler name
 * 
 * @export
 * @class Dispatcher
 * @implements {IDispatcher}
 */
export default class Dispatcher implements IDispatcher {
    // Contains the mapping of the event with the handler name
    private _instances: DispatchInstance[] = [];

    /**
     * Get all notification handlers order by order field for the specified event name
     *
     * @param {string} eventName The event name for which to get handlers
     * @returns {DispatchInstance[]}
     * @memberof Dispatcher
     */
    
    public getAll(eventName: string): DispatchInstance[] {
        const items = this._instances.filter((p) => p.eventName === eventName);
        if (items.length === 0)
            throw new Error(`Cannot find notification handler with key: ${eventName}`);
        return items.sort(byOrder);
    }

    /**
     * Add a dispatch instance to the container
     *
     * @param {DispatchInstance} instance The instance to add
     * @memberof Dispatcher
     */
    public add(instance: DispatchInstance): void {
        this._instances.push(instance);
    }

    /**
     * Remove all handlers for the specific event name
     *
     * @param {string} eventName The event for which remove the handlers
     * @memberof Dispatcher
     */
    public remove(eventName: string): void {
        this._instances = this._instances.filter((p) => p.eventName !== eventName);
    }

    /**
     * Clear all instances from the container
     *
     * @memberof Dispatcher
     */
    public clear(): void {
        this._instances = [];
    }
}

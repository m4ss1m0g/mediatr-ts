/* eslint-disable @typescript-eslint/ban-types */

import type { BehaviorMappings, NotificationMappings } from "@/models/dispatcher/mappings.js";

export type OrderedMapping<TData = {}> = TData & {
    order?: number;
}

/**
 * The dispatcher interface
 * for changing the container and resolution of instances
 * 
 * @export
 * @interface IDispatcher
 */
export default interface Dispatcher {
    get notifications(): NotificationMappings;
    get behaviors(): BehaviorMappings;
}

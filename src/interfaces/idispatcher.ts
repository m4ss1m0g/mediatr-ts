/* eslint-disable @typescript-eslint/ban-types */

import type { BehaviorMappings, NotificationMappings } from "@/models/dispatcher/mappings";

export type OrderMapping<TData = {}> = TData & {
    order?: number;
}

/**
 * The dispatcher interface
 * Implement this interface and call mediatrSettings.dispatcher at startup
 * for changing the container and resolution of instances
 * 
 * @export
 * @interface IDispatcher
 */
export default interface IDispatcher {
    get notifications(): NotificationMappings;
    get behaviors(): BehaviorMappings;
}

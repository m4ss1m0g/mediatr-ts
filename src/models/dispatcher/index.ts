/* eslint-disable @typescript-eslint/ban-types */

import type { default as DispatcherInterface } from "@/interfaces/idispatcher.js";
import Resolver from "@/interfaces/iresolver";
import ResolverImplementation from "@/models/resolver.js"
import { BehaviorMappings, NotificationMappings } from "@/models/dispatcher/mappings.js";

export type OrderMapping<TData = {}> = TData & {
    order?: number;
}

/**
 * The internal dispatcher
 * Here storing the mapping between the event name with the handler name
 * 
 * @export
 * @class Dispatcher
 * @implements {Dispatcher}
 */
export default class Dispatcher implements DispatcherInterface {
    private static _instance: DispatcherInterface | undefined;

    private readonly _notifications: NotificationMappings;
    private readonly _behaviors: BehaviorMappings;

    public static get instance() {
        if(this._instance) {
            return this._instance;
        }

        const instance = new Dispatcher(ResolverImplementation.instance);
        this._instance = instance;

        return instance;
    }

    public static set instance(value: DispatcherInterface) {
        this._instance = value;
    }

    public constructor(
        resolver: Resolver,
    ) {
        this._notifications = new NotificationMappings(resolver);
        this._behaviors = new BehaviorMappings(resolver);
    }

    get notifications() {
        return this._notifications;
    }

    get behaviors() {
        return this._behaviors;
    }
}
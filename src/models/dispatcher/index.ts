/* eslint-disable @typescript-eslint/ban-types */

import type IDispatcher from "@/interfaces/idispatcher.js";
import { BehaviorMappings, NotificationMappings } from "@/models/dispatcher/mappings.js";

/**
 * The internal dispatcher
 * Here storing the mapping between the event name with the handler name
 * 
 * @export
 * @class Dispatcher
 * @implements {IDispatcher}
 */
export default class Dispatcher implements IDispatcher {
    private readonly _notifications: NotificationMappings;
    private readonly _behaviors: BehaviorMappings;

    constructor() {
        this._notifications = new NotificationMappings();
        this._behaviors = new BehaviorMappings();
    }

    get notifications() {
        return this._notifications;
    }

    get behaviors() {
        return this._behaviors;
    }
}
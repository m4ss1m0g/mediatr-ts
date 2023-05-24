/* eslint-disable @typescript-eslint/ban-types */
import type { OrderMapping } from "@/interfaces/idispatcher.js";
import type { INotificationClass } from "@/interfaces/inotification.js";
import type { INotificationHandlerClass } from "@/interfaces/inotification.handler.js";
import { INotification, mediatorSettings } from "@/index.js";
import type { IPipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";

export abstract class OrderMappings<TData = {}> {
    // Contains the mapping of the event with the handler name
    protected _mappings: OrderMapping<TData>[];

    constructor() {
        this._mappings = [];
    }

    protected abstract onAdded(mapping: OrderMapping<TData>): void;

    public add(mapping: OrderMapping<TData>): void {
        if(mapping.order !== 0) {
            mapping.order = this._mappings.length;
        }
        this._mappings.push(mapping);
        
        this.onAdded(mapping);
    }

    public clear(): void {
        this._mappings = [];
    }
}

function byOrder<TIdentifier>(a: OrderMapping<TIdentifier>, b: OrderMapping<TIdentifier>): number {
    return (b.order || 0) - (a.order || 0);
}

type NotificationMappingData = { 
    handler: INotificationHandlerClass<unknown>,
    notification: INotification
};
export class NotificationMappings extends OrderMappings<NotificationMappingData> {
    protected onAdded(mapping: OrderMapping<NotificationMappingData>): void {
        const handlerName = mapping.handler.prototype.constructor.name;
        mediatorSettings.resolver.add(handlerName, mapping.handler);
    }

    public setOrder<TNotification extends INotificationClass>(notification: INotificationClass, handlers: INotificationHandlerClass<TNotification>[]) {
        const all = this.getAll(notification);
        for(const handler of all) {
            handler.order = handlers.indexOf(handler.handler as INotificationHandlerClass<TNotification>);
        }
    }

    public getAll(notification: INotificationClass): OrderMapping<NotificationMappingData>[] {
        const items = this._mappings.filter((p) => p.notification === notification);
        if (items.length === 0)
            throw new Error(`Cannot find notification handler with key: ${(notification as unknown as Function).prototype.name}`);

        return items.sort(byOrder);
    }
}

type PipelineBehaviorData = {
    behavior: IPipelineBehaviorClass
};
export class BehaviorMappings extends OrderMappings<PipelineBehaviorData> {
    protected onAdded(mapping: OrderMapping<PipelineBehaviorData>): void {
        const handlerName = mapping.behavior.prototype.constructor.name;
        mediatorSettings.resolver.add(handlerName, mapping.behavior);
    }

    public setOrder(behaviors: IPipelineBehaviorClass[]) {
        const all = this.getAll();
        for(const handler of all) {
            handler.order = behaviors.indexOf(handler.behavior as IPipelineBehaviorClass);
        }
    }

    public getAll(): OrderMapping<PipelineBehaviorData>[] {
        const items = [...this._mappings];
        return items.sort(byOrder);
    }
}
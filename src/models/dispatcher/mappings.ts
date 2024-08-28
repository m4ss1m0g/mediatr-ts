/* eslint-disable @typescript-eslint/ban-types */
import type { OrderedMapping } from "@/interfaces/idispatcher.js";
import type { NotificationClass } from "@/models/notification.js";
import type { NotificationHandlerClass } from "@/interfaces/inotification.handler.js";
import type { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";
import Resolver from "@/interfaces/iresolver";

export abstract class OrderedMappings<TData = {}> {
    // Contains the mapping of the event with the handler name
    protected _mappings: OrderedMapping<TData>[];

    constructor() {
        this._mappings = [];
    }

    protected abstract onAdded(mapping: OrderedMapping<TData>): void;

    public add(mapping: OrderedMapping<TData>): void {
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

function byOrder<TIdentifier>(a: OrderedMapping<TIdentifier>, b: OrderedMapping<TIdentifier>): number {
    return (b.order || 0) - (a.order || 0);
}

type NotificationMappingData = { 
    handler: NotificationHandlerClass<unknown>,
    notification: NotificationClass
};
export class NotificationMappings extends OrderedMappings<NotificationMappingData> {
    public constructor(
        private readonly resolver: Resolver
    ) {
        super();
    }

    protected onAdded(mapping: OrderedMapping<NotificationMappingData>): void {
        const handlerName = mapping.handler.prototype.constructor.name;
        this.resolver.add(handlerName, mapping.handler);
    }

    public setOrder<TNotification extends NotificationClass>(notification: NotificationClass, handlers: NotificationHandlerClass<TNotification>[]) {
        const all = this.getAll(notification);
        for(const handler of all) {
            handler.order = handlers.indexOf(handler.handler as NotificationHandlerClass<TNotification>);
        }
    }

    public getAll(notification: NotificationClass): OrderedMapping<NotificationMappingData>[] {
        const items = this._mappings.filter((p) => p.notification === notification);
        if (items.length === 0)
            throw new Error(`Cannot find notification handler with key: ${(notification as unknown as Function).prototype.name}`);

        return items.sort(byOrder);
    }
}

type PipelineBehaviorData = {
    behavior: PipelineBehaviorClass
};
export class BehaviorMappings extends OrderedMappings<PipelineBehaviorData> {
    public constructor(
        private readonly resolver: Resolver
    ) {
        super();
    }

    protected onAdded(mapping: OrderedMapping<PipelineBehaviorData>): void {
        const handlerName = mapping.behavior.prototype.constructor.name;
        this.resolver.add(handlerName, mapping.behavior);
    }

    public setOrder(behaviors: PipelineBehaviorClass[]) {
        const all = this.getAll();
        for(const handler of all) {
            handler.order = behaviors.indexOf(handler.behavior as PipelineBehaviorClass);
        }
    }

    public getAll(): OrderedMapping<PipelineBehaviorData>[] {
        const items = [...this._mappings];
        return items.sort(byOrder);
    }
}
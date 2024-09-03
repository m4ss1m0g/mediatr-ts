/* eslint-disable @typescript-eslint/ban-types */
import type { NotificationClass } from "@/models/notification.js";
import type { NotificationHandlerClass } from "@/interfaces/inotification.handler.js";
import type { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";
import { RequestHandlerClass } from "@/interfaces/irequest.handler";
import RequestBase, { RequestClass } from "./request";

type OrderedMapping<TData = {}> = TData & {
    order?: number;
}

abstract class OrderedMappings<TData = {}> {
    protected _mappings: OrderedMapping<TData>[];

    constructor() {
        this._mappings = [];
    }

    public add(mapping: OrderedMapping<TData>): void {
        if(mapping.order !== 0) {
            mapping.order = this._mappings.length;
        }
        this._mappings.push(mapping);
    }

    public clear(): void {
        this._mappings = [];
    }
}

type NotificationMappingData = { 
    handlerClass: NotificationHandlerClass<unknown>,
    notificationClass: NotificationClass
};
class NotificationMappings extends OrderedMappings<NotificationMappingData> {
    public setOrder<TNotification extends NotificationClass>(notificationClass: NotificationClass, handlerClasses: NotificationHandlerClass<TNotification>[]) {
        const all = this.getAll(notificationClass);
        for(const handler of all) {
            handler.order = handlerClasses.indexOf(handler.handlerClass as NotificationHandlerClass<TNotification>);
        }
    }

    public getAll(notificationClass?: NotificationClass): OrderedMapping<NotificationMappingData>[] {
        const items = this._mappings.filter((p) => p.notificationClass === notificationClass || !notificationClass);
        if(items.length === 0 && notificationClass) {
            throw new Error(`No handler found for notification ${notificationClass.name}. Remember to decorate your handler with @notificationHandler(${notificationClass.name}).`);
        }

        return items.sort(byOrder);
    }
}

type RequestMappingData = { 
    handlerClass: RequestHandlerClass<RequestBase<unknown>, unknown>,
    requestClass: RequestClass<unknown>
};
class RequestMappings extends OrderedMappings<RequestMappingData> {
    public getAll(requestClass?: RequestClass<unknown>): OrderedMapping<RequestMappingData>[] {
        const items = this._mappings.filter((p) => p.requestClass === requestClass || !requestClass);
        if(items.length === 0 && requestClass) {
            throw new Error(`No handler found for request ${requestClass.name}. Remember to decorate your handler with @requestHandler(${requestClass.name}).`);
        }

        return items.sort(byOrder);
    }
}

type PipelineBehaviorData = {
    behaviorClass: PipelineBehaviorClass
};
class BehaviorMappings extends OrderedMappings<PipelineBehaviorData> {
    public setOrder(behaviorClasses: PipelineBehaviorClass[]) {
        const all = this.getAll();
        for(const handler of all) {
            handler.order = behaviorClasses.indexOf(handler.behaviorClass as PipelineBehaviorClass);
        }
    }

    public getAll(): OrderedMapping<PipelineBehaviorData>[] {
        const items = [...this._mappings];
        return items.sort(byOrder);
    }
}

function byOrder<TIdentifier>(a: OrderedMapping<TIdentifier>, b: OrderedMapping<TIdentifier>): number {
    return (b.order || 0) - (a.order || 0);
}

export const typeMappings = {
    pipelineBehaviors: new BehaviorMappings(),
    notifications: new NotificationMappings(),
    requestHandlers: new RequestMappings(),
}
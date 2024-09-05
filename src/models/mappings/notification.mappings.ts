import { NotificationHandlerClass } from "@/interfaces/inotification.handler";
import { NotificationClass } from "../notification";
import { byOrder, OrderedMapping, OrderedMappings } from "./ordered.mappings";

type NotificationHandlerMappingData = { 
    handlerClass: NotificationHandlerClass<unknown>,
    notificationClass: NotificationClass
};

export class NotificationHandlerMappings extends OrderedMappings<NotificationHandlerMappingData> {
    public setOrder<TNotification extends NotificationClass>(notificationClass: NotificationClass, handlerClasses: NotificationHandlerClass<TNotification>[]) {
        const all = this.getAll(notificationClass);
        for(const handler of all) {
            handler.order = handlerClasses.indexOf(handler.handlerClass as NotificationHandlerClass<TNotification>);
        }
    }

    public getAll(notificationClass?: NotificationClass): OrderedMapping<NotificationHandlerMappingData>[] {
        const items = this._mappings.filter((p) => p.notificationClass === notificationClass || !notificationClass);
        if(items.length === 0 && notificationClass) {
            throw new Error(`No handler found for notification ${notificationClass.name}. Remember to decorate your handler with @notificationHandler(${notificationClass.name}).`);
        }

        return items.sort(byOrder);
    }
}
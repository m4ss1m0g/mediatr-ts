import { NotificationHandlerClass } from "@/interfaces/inotification.handler";
import { NotificationClass } from "../notification";
import { byOrder, OrderedMapping, OrderedMappings } from "./ordered.mappings";

type NotificationHandlerMappingData = { 
    handlerClass: NotificationHandlerClass<unknown>,
    notificationClass: NotificationClass
};

/**
 * NotificationHandlerMappings class extends OrderedMappings and is used to 
 * manage notification handlers for specific notification classes.
 * 
 * @exports
 */
export class NotificationHandlerMappings extends OrderedMappings<NotificationHandlerMappingData> {

    /**
     * This method sets the order of notification handlers for a specific notification class. 
     * It takes a notification class and an array of handler classes as input, and updates the order of each handler in 
     * the array based on its index.
     * In essence, it allows you to specify the order in which notification handlers should be executed for a particular 
     * notification class.
     *
     * @param notificationClass The notification class for which to set the order.
     * @param handlerClasses The array of handler classes in the order in which they should be executed.
     */
    public setOrder<TNotification extends NotificationClass>(notificationClass: NotificationClass, handlerClasses: NotificationHandlerClass<TNotification>[]) {
        const all = this.getAll(notificationClass);
        for(const handler of all) {
            handler.order = handlerClasses.indexOf(handler.handlerClass as NotificationHandlerClass<TNotification>);
        }
    }

    /**
     * Retrieves all notification handlers for a specific notification class. 
     * If no class is provided, it returns all handlers. 
     * If no handlers are found for the specified class, it throws an error.
     * 
     * The returned handlers are sorted by their order.
     * 
     * @param notificationClass The notification class for which to retrieve the handlers.
     * @returns The array of handler classes in the order in which they should be executed.
     */
    public getAll(notificationClass?: NotificationClass): OrderedMapping<NotificationHandlerMappingData>[] {
        const items = this._mappings.filter((p) => p.notificationClass === notificationClass || !notificationClass);
        if(items.length === 0 && notificationClass) {
            throw new Error(`No handler found for notification ${notificationClass.name}. Remember to decorate your handler with @notificationHandler(${notificationClass.name}).`);
        }

        return items.sort(byOrder);
    }
}
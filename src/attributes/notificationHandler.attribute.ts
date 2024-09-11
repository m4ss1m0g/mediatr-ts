/* eslint-disable @typescript-eslint/ban-types */
import type { NotificationClass } from "@/models/notificationData.js";
import type { NotificationHandlerClass } from "@/interfaces/notificationHandler.js";
import { typeMappings } from "@/models/mappings/index.js";

/**
 * Decorate the notificationHandler with this attribute
 * 
 * @param value The request type
 * @param order The order of event
 */
const notificationHandler = (value: NotificationClass) => {
    return (target: Function): void => {
        typeMappings.notifications.add({
            notificationClass: value,
            handlerClass: target as NotificationHandlerClass<unknown>
        });
    };
};

export default notificationHandler;

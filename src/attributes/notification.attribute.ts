/* eslint-disable @typescript-eslint/ban-types */
import type { NotificationClass } from "@/models/notification.js";
import type { NotificationHandlerClass } from "@/interfaces/inotification.handler.js";
import Dispatcher from "@/models/dispatcher/index.js";

/**
 * Decorate the notificationHandler with this attribute
 * 
 * @param value The request type
 * @param order The order of event
 */
const notificationHandler = (value: NotificationClass) => {
    return (target: Function): void => {
        Dispatcher.instance.notifications.add({
            notification: value,
            handler: target as NotificationHandlerClass<unknown>
        });
    };
};

export default notificationHandler;

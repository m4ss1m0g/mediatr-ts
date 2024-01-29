/* eslint-disable @typescript-eslint/ban-types */
import type { INotificationClass } from "@/interfaces/inotification.js";
import type { INotificationHandlerClass } from "@/interfaces/inotification.handler.js";
import {mediatorSettings} from "@/index.js";

/**
 * Decorate the notificationHandler with this attribute
 * 
 * @param value The request type
 * @param order The order of event
 */
const notificationHandler = (value: INotificationClass, uniqueId?: string) => {
    return (target: Function): void => {
        mediatorSettings.dispatcher.notifications.add({
            notification: value,
            handler: target as INotificationHandlerClass<unknown>,
            uniqueId
        });
    };
};

export default notificationHandler;

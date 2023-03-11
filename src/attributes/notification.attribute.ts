/* eslint-disable @typescript-eslint/ban-types */
import type { INotificationClass } from "@/interfaces/inotification";
import type { INotificationHandlerClass } from "@/interfaces/inotification.handler";
import {mediatorSettings} from "@/index";

/**
 * Decorate the notificationHandler with this attribute
 * 
 * @param value The request type
 * @param order The order of event
 */
const notificationHandler = (value: INotificationClass) => {
    return (target: Function): void => {
        mediatorSettings.dispatcher.notifications.add({
            notification: value,
            handler: target as INotificationHandlerClass<unknown>
        });
    };
};

export default notificationHandler;

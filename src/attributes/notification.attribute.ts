/* eslint-disable @typescript-eslint/ban-types */
import INotification from "@/interfaces/inotification";
import DispatchInstance from "@/models/dispatch.instance";
import settings from "@/settings";

/**
 * Decorate the notificationHandler with this attribute
 * 
 * @param value The request type
 * @param order The order of event
 */
const notificationHandler = (value: INotification, order?: number) => {
    return (target: Function): void => {
        const eventName = (value as Function).prototype.constructor.name;
        const handlerName = (target as Function).prototype.constructor.name;
        settings.resolver.add(handlerName, target);
        settings.dispatcher.add(new DispatchInstance(eventName, handlerName, order || 0));
    };
};

export default notificationHandler;


import IRequest from "@/interfaces/irequest";
import IRequestHandler from "@/interfaces/irequest.handler";
import requestHandler from "@/attributes/request.attribute";

import INotification from "@/interfaces/inotification";
import INotificationHandler from "@/interfaces/inotification.handler";
import NotificationHandler from "@/attributes/notification.attribute";

import IDispatcher from "@/interfaces/idispatcher";
import IResolver from "@/interfaces/iresolver";

import IMediator from "@/interfaces/imediator";
import Mediator from "@/models/mediator";
import mediatorSettings from "@/settings";

import DispatchInstance from "@/models/dispatch.instance";

export {
    IRequest,
    IRequestHandler,
    requestHandler,

    INotification,
    NotificationHandler,
    INotificationHandler,

    IDispatcher,
    DispatchInstance,
    
    IResolver,

    IMediator,
    Mediator,
    mediatorSettings,
};

/**
 * @deprecated Use requestHandler instead
 */
export const Handler = requestHandler;

/**
 * @deprecated Use requestHandler instead
 */
export const RequestHandler = requestHandler;

import mediatorSettings from "@/settings";

import type IRequest from "@/interfaces/irequest";
import type IRequestHandler from "@/interfaces/irequest.handler";
import requestHandler from "@/attributes/request.attribute";

import type INotification from "@/interfaces/inotification";
import type INotificationHandler from "@/interfaces/inotification.handler";
import notificationHandler from "@/attributes/notification.attribute";

import type IDispatcher from "@/interfaces/idispatcher";
import type IResolver from "@/interfaces/iresolver";

import type IMediator from "@/interfaces/imediator";
import Mediator from "@/models/mediator";

export {
    IRequest,
    IRequestHandler,
    requestHandler,

    INotification,
    notificationHandler,
    INotificationHandler,

    IDispatcher,
    
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

/**
 * @deprecated Use notificationHandler instead
 */
export const NotificationHandler = notificationHandler;
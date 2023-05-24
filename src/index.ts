import mediatorSettings from "@/settings.js";

import type IRequest from "@/interfaces/irequest.js";
import type IRequestHandler from "@/interfaces/irequest.handler.js";
import requestHandler from "@/attributes/request.attribute.js";

import type INotification from "@/interfaces/inotification.js";
import type INotificationHandler from "@/interfaces/inotification.handler.js";
import notificationHandler from "@/attributes/notification.attribute.js";

import type IDispatcher from "@/interfaces/idispatcher.js";
import type IResolver from "@/interfaces/iresolver.js";

import type IMediator from "@/interfaces/imediator.js";
import Mediator from "@/models/mediator.js";

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
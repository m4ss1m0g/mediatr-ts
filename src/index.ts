import RequestData from "@/models/request-data.js";
import type RequestHandler from "@/interfaces/irequest.handler.js";
import requestHandler from "@/attributes/request.attribute.js";

import NotificationData from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import notificationHandler from "@/attributes/notification.attribute.js";

import type Resolver from "@/interfaces/iresolver.js";
import type { Class } from "@/interfaces/iresolver.js";

import type PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import pipelineBehavior from "@/attributes/pipeline.behavior.attribute.js";

import Mediator from "./models/mediator";

export {
    RequestData as RequestBase,
    RequestHandler,
    requestHandler,
    NotificationData as NotificationBase,
    notificationHandler,
    NotificationHandler,
    Resolver,
    Mediator,
    PipelineBehavior,
    pipelineBehavior,
    Class
};

/**
 * @deprecated Use requestHandler instead
 */
export const Handler = requestHandler;

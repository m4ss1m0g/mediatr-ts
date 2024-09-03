import RequestBase from "@/models/request.js";
import type RequestHandler from "@/interfaces/irequest.handler.js";
import requestHandler from "@/attributes/request.attribute.js";

import NotificationBase from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import notificationHandler from "@/attributes/notification.attribute.js";

import type Resolver from "@/interfaces/iresolver.js";
import type { Class } from "@/interfaces/iresolver.js";

import type PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import pipelineBehavior from "@/attributes/pipeline.behavior.attribute.js";

import Mediator from "./models/mediator";

export {
    RequestBase,
    RequestHandler,
    requestHandler,
    NotificationBase,
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

import RequestBase from "@/models/request.js";
import RequestHandler from "@/interfaces/irequest.handler.js";
import requestHandler from "@/attributes/request.attribute.js";

import NotificationBase from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import notificationHandler from "@/attributes/notification.attribute.js";

import type Dispatcher from "@/interfaces/idispatcher.js";
import type Resolver from "@/interfaces/iresolver.js";

import PipelineBehavior from "@/interfaces/ipipeline.behavior.js";
import pipelineBehavior from "@/attributes/pipeline.behavior.attribute.js";
import Mediator from "./models/mediator";

export {
    RequestBase,
    RequestHandler,
    requestHandler,
    NotificationBase,
    notificationHandler,
    NotificationHandler,
    Dispatcher,
    Resolver,
    Mediator,
    PipelineBehavior,
    pipelineBehavior
};

/**
 * @deprecated Use requestHandler instead
 */
export const Handler = requestHandler;

import RequestData from "@/models/request.data.js";
import type RequestHandler from "@/interfaces/request.handler.js";
import requestHandler from "@/attributes/request.attribute.js";

import NotificationData from "@/models/notification.js";
import type NotificationHandler from "@/interfaces/notification.handler.js";
import notificationHandler from "@/attributes/notification.attribute.js";

import type Resolver from "@/interfaces/resolver.js";
import type { Class } from "@/interfaces/resolver.js";

import type PipelineBehavior from "@/interfaces/pipeline.behavior.js";
import pipelineBehavior from "@/attributes/pipeline.behavior.attribute.js";

import Mediator from "./models/mediator";

export {
    RequestData,
    RequestHandler,
    requestHandler,
    NotificationData,
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

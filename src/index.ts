import RequestData from "@/models/requestData.js";
import type RequestHandler from "@/interfaces/requestHandler.js";
import requestHandler from "@/attributes/requestHandler.attribute.js";

import NotificationData from "@/models/notificationData.js";
import type NotificationHandler from "@/interfaces/notificationHandler.js";
import notificationHandler from "@/attributes/notificationHandler.attribute.js";

import type Resolver from "@/interfaces/resolver.js";
import type { Class } from "@/interfaces/resolver.js";

import type PipelineBehavior from "@/interfaces/pipelineBehavior.js";
import pipelineBehavior from "@/attributes/pipelineBehavior.attribute.js";

import Mediator from "./models/mediator.js";

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

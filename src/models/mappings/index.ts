import { NotificationHandlerMappings } from "./notificationHandlerMappings.js";
import { PipelineBehaviorMappings } from "./pipelineBehaviorMappings.js";
import { RequestHandlerMappings } from "./requestHandlerMappings.js";

export const typeMappings = {
    pipelineBehaviors: new PipelineBehaviorMappings(),
    notifications: new NotificationHandlerMappings(),
    requestHandlers: new RequestHandlerMappings(),
}

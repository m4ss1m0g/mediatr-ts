import { NotificationHandlerMappings } from "./notification.mappings";
import { PipelineBehaviorMappings } from "./pipeline.behavior.mappings";
import { RequestHandlerMappings } from "./request.handler.mappings";

export const typeMappings = {
    pipelineBehaviors: new PipelineBehaviorMappings(),
    notifications: new NotificationHandlerMappings(),
    requestHandlers: new RequestHandlerMappings(),
}
import { NotificationHandlerMappings } from "./notificationHandlerMappings";
import { PipelineBehaviorMappings } from "./pipelineBehaviorMappings";
import { RequestHandlerMappings } from "./requestHandlerMappings";

export const typeMappings = {
    pipelineBehaviors: new PipelineBehaviorMappings(),
    notifications: new NotificationHandlerMappings(),
    requestHandlers: new RequestHandlerMappings(),
}
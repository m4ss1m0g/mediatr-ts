import IMediator from "@/interfaces/imediator";
import IRequest from "@/interfaces/irequest";
import settings from "@/settings";

/**
 * The mediator class to send requests
 */
export default class Mediator implements IMediator {
    /**
     * Send a request to the mediator
     * @param request The request to send
     */
    public async send<T>(request: IRequest<T>): Promise<T> {
        const name = request.constructor.name;

        const handler = settings.resolver.resolve<T>(name);
        return handler.handle(request);
    }
}

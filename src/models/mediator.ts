import IMediator from "@/interfaces/imediator";
import IRequest from "@/interfaces/irequest";
import settings from "@/settings";

export default class Mediator implements IMediator {
    public async send<T>(request: IRequest<T>): Promise<T> {
        const name = request.constructor.name;

        const handler = settings.resolver.resolve<T>(name);
        return handler.handle(request);
    }
}

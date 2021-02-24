import IMediator from "@/interfaces/imediator";
import IRequest from "@/interfaces/irequest";
import settings from "@/settings";

export default class Mediator implements IMediator {
    public async send<Input, Output>(request: IRequest<Input>): Promise<Output> {
        const name = request.constructor.name;

        const handler = settings.resolver.resolve<Input, Output>(name);
        return handler.handle(request);
    }
}

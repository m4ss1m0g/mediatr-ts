import container from "@/container";
import IMediator from "@/imediator";
import IRequest from "@/irequest";

export default class Mediator implements IMediator {
    public async send<T>(request: IRequest<T>): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const name = request.constructor.name;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handlerFx: any = container.resolve(name);
        const obj = new handlerFx();
        return obj.handle(request);
    }
}
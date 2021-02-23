import container from "@/container";
import IMediator from "@/imediator";
import IRequest from "@/irequest";
import IRequestHandler from "@/irequesthandler";
import { Container } from "inversify";

export default class Mediator implements IMediator {
    private _container?: Container;

    constructor(container?: Container) {
        this._container = container;
    }

    public async send<T>(request: IRequest<T>): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const name = request.constructor.name;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this._container) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fx: IRequestHandler<IRequest<T>, any> = this._container.get(name);
            return fx.handle(request);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handlerFx: any = container.resolve(name);
            const obj = new handlerFx();
            return obj.handle(request);
        }
    }
}

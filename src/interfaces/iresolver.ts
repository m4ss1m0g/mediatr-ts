import IRequest from "./irequest";
import IRequestHandler from "./irequesthandler";

export default interface IResolver {
    resolve<Input, Output>(name: string): IRequestHandler<IRequest<Input>, Output>;

    // eslint-disable-next-line @typescript-eslint/ban-types
    add(name: string, instance: Function): void;

    remove(name: string): void;

    clear(): void;
}

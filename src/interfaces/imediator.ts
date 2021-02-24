import IRequest from "./irequest";

export default interface IMediator {
    send<T>(request: IRequest<T>): Promise<T>;
}

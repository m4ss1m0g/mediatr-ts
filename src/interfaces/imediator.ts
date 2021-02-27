import IRequest from "./irequest";

/**
 * The mediator interface
 *
 * @export
 * @interface IMediator
 */
export default interface IMediator {
    /**
     * Send a request to the mediator
     * @param request The request to send
     */
    send<T>(request: IRequest<T>): Promise<T>;
}

export default interface IRequestHandler<Input, Output> {
    handle(value: Input): Promise<Output>;
}

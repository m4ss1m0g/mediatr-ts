import {
    IRequest,
    IRequestHandler,
    Mediator,
    requestHandler,
} from "mediatr-ts";

(async () => {
    // request.ts -> Define the request
    class Request implements IRequest<string> {
        name?: string;
    }

    // handlertest.ts -> Add the attribute to the request handler
    @requestHandler(Request)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class HandlerTest implements IRequestHandler<Request, string> {
        handle(value: Request): Promise<string> {
            return Promise.resolve(`Value passed ${value.name}`);
        }
    }

    // main.ts -> Instantiate the mediator
    const mediator = new Mediator();

    // Create the request
    const r = new Request();
    r.name = "Foo";

    // Send the command
    const result = await mediator.send<string>(r);
    console.log(result);
})();

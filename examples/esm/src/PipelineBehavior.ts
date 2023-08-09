import {
    IPipelineBehavior,
    IRequest,
    IRequestHandler,
    Mediator,
    pipelineBehavior,
    requestHandler,
} from "mediatr-ts";

class Request {
    name?: string;
}

@requestHandler(Request)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HandlerTest implements IRequestHandler<Request, string> {
    handle(value: Request): Promise<string> {
        return Promise.resolve(`Value passed ${value.name}`);
    }
}

@pipelineBehavior()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PipelineBehaviorTest implements IPipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        if (request instanceof Request) {
            request.name += " with stuff";
        }

        let result = await next();
        if (typeof result === "string") {
            result += " after";
        }

        return result;
    }
}

const r = new Request();
r.name = "Foo";

// Act
const mediator = new Mediator();
const result = await mediator.send(r);

console.log(result);

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type IPipelineBehavior,
    Mediator,
    IRequestHandler,
    mediatorSettings,
    requestHandler,
    IRequest,
    pipelineBehavior,
} from "@/index.js";
import Resolver from "@/models/resolver.js";

describe("Resolver with local container", () => {
    beforeEach(() => {
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.behaviors.clear();
    });

    test("Should resolve existing instance", async () => {
        // Arrange
        mediatorSettings.resolver = new Resolver();

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

        // Assert
        expect(result).toBe("Value passed Foo with stuff after");
    });

    test("Should resolve existing instance", async () => {
        // Arrange
        mediatorSettings.resolver = new Resolver();

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
        class PipelineBehaviorTest1 implements IPipelineBehavior {
            async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
                if (request instanceof Request) {
                    request.name += " with stuff 1";
                }

                let result = await next();
                if (typeof result === "string") {
                    result += " after 1";
                }

                return result;
            }
        }

        @pipelineBehavior()
        class PipelineBehaviorTest2 implements IPipelineBehavior {
            async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
                if (request instanceof Request) {
                    request.name += " with stuff 2";
                }

                let result = await next();
                if (typeof result === "string") {
                    result += " after 2";
                }

                return result;
            }
        }

        const r = new Request();
        r.name = "Foo";

        // Act
        const mediator = new Mediator();
        const result = await mediator.send(r);

        // Assert
        expect(result).toBe("Value passed Foo with stuff 2 with stuff 1 after 1 after 2");
    });
});

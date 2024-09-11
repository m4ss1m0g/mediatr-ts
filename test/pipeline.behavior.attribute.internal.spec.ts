import "reflect-metadata";
import {
    Mediator,
    pipelineBehavior,
    PipelineBehavior,
    RequestHandler,
    requestHandler,
} from "@/index.js";
import RequestData from "@/models/requestData.js";
import { typeMappings } from "@/models/mappings/index.js";
import { OrderedMappings } from "@/models/mappings/orderedMappings";

describe("Resolver with local container", () => {
    beforeEach(() => {
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    test("Should resolve existing instance with one behavior", async () => {
        // Arrange

        class Request extends RequestData<string> {
            name?: string;
        }

        @requestHandler(Request)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerTest implements RequestHandler<Request, string> {
            handle(value: Request): Promise<string> {
                return Promise.resolve(`Value passed ${value.name}`);
            }
        }

        @pipelineBehavior()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class PipelineBehaviorTest implements PipelineBehavior {
            async handle(request: RequestData<unknown>, next: () => unknown): Promise<unknown> {
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

        const request = new Request();
        request.name = "Foo";

        // Act
        const mediator = new Mediator();
        const result = await mediator.send(request);

        // Assert
        const behaviour = mediator.pipelineBehaviors as unknown as OrderedMappings
        expect(behaviour.length).toBe(1);
        expect(result).toBe("Value passed Foo with stuff after");
    });

    test("Should resolve existing instance with two behaviors", async () => {
        // Arrange
        class Request extends RequestData<string> {
            name?: string;
        }

        @requestHandler(Request)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerTest implements RequestHandler<Request, string> {
            handle(value: Request): Promise<string> {
                return Promise.resolve(`Value passed ${value.name}`);
            }
        }

        @pipelineBehavior()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class PipelineBehaviorTest1 implements PipelineBehavior {
            async handle(request: RequestData<unknown>, next: () => unknown): Promise<unknown> {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class PipelineBehaviorTest2 implements PipelineBehavior {
            async handle(request: RequestData<unknown>, next: () => unknown): Promise<unknown> {
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

        const request = new Request();
        request.name = "Foo";

        // Act
        const mediator = new Mediator();
        const result = await mediator.send(request);

        // Assert
        expect(result).toBe("Value passed Foo with stuff 2 with stuff 1 after 1 after 2");
    });
});

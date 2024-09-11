import "reflect-metadata";
import { Mediator, RequestHandler, requestHandler } from "@/index.js";
import RequestData from "@/models/requestData.js";
import { typeMappings } from "@/models/mappings/index.js";

describe("Resolver with local container", () => {
    beforeEach(() => {
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    test("Should resolve existing instance", async () => {
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

        const r = new Request();
        r.name = "Foo";

        // Act
        const mediator = new Mediator();
        const result = await mediator.send(r);

        // Assert
        expect(result).toBe("Value passed Foo");
    });

    test("Should add the instance to the container when adding attribute to a class", () => {
        // Arrange

        // Add the spy
        const add = jest.spyOn(typeMappings.requestHandlers, "add");

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

        expect(add).toBeCalled();
        add.mockRestore();
    });

    test("Should throw duplicate key when adding attribute with same class the resolver", () => {
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

        const fx = () => {
            @requestHandler(Request)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class HandlerTest implements RequestHandler<Request, string> {
                handle(value: Request): Promise<string> {
                    return Promise.resolve(`Value passed ${value.name}`);
                }
            }
        };

        expect(fx).toThrowError();
    });

    test("Should throw 'cannot find element with key' when instance not found on container", async () => {
        const m = new Mediator();
        const fx = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await m.send<string>("foo" as any);
        };

        await expect(fx()).rejects.toThrowError();
    });
});

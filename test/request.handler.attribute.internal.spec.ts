import { Mediator, IRequestHandler, mediatorSettings, requestHandler } from "@/index";
import Resolver from "@/models/resolver";

describe("Resolver with local container", () => {
    beforeEach(() => {
        mediatorSettings.resolver.clear();
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
        mediatorSettings.resolver = new Resolver();

        // Add the spy
        const add = jest.spyOn(mediatorSettings.resolver, "add");

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

        expect(add).toBeCalled();
        add.mockRestore();
    });

    test("Should throw duplicate key when adding attribute with same class the resolver", () => {
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

        const fx = () => {
            @requestHandler(Request)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class HandlerTest implements IRequestHandler<Request, string> {
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
            await m.send<string>("foo");
        };

        await expect(fx()).rejects.toThrowError();
    });
});

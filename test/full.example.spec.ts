/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import { Container, inject, injectable } from "inversify";
import RequestData from "@/models/request.data.js";
import { Mediator, RequestHandler, requestHandler, Resolver } from "@/index.js";
import { Class } from "@/interfaces/resolver";
import { typeMappings } from "@/models/mappings/index.js";

describe("The full example", () => {
    beforeEach(() => {
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    test("Should resolve existing instance", async () => {
        const container = new Container();
    
        // inversify.resolver.ts -> Implement the resolver
        class InversifyResolver implements Resolver {
            resolve<T>(type: Class<T>): T {
                return container.get(type);
            }
    
            add<T>(type: Class<T>): void {
                container.bind(type).toSelf();
            }
        }
    
        // You can later configure the inversify container
        interface IWarrior {
            fight(): string;
        }
    
        const TYPES = {
            IWarrior: Symbol.for("IWarrior"),
        };
    
        @injectable()
        class Ninja implements IWarrior {
            fight(): string {
                return "ninja fight";
            }
        }
    
        container.bind<IWarrior>(TYPES.IWarrior).to(Ninja);
    
        // The request object
        class Request extends RequestData<string> {
            constructor(
                public readonly thenumber: number
            ) {
                super();
            }
        }
    
        // Decorate the handler request with Handler and injectable attribute, notice the warrior property
        @requestHandler(Request)
        @injectable()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerRequest implements RequestHandler<Request, string> {
            @inject(TYPES.IWarrior)
            public warrior!: IWarrior; // Instantiated by the inversify
    
            public handle(value: Request): Promise<string> {
                return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
            }
        }

        const mediator = new Mediator({
            resolver: new InversifyResolver()
        });
        const result = await mediator.send(new Request(99));

        expect(result).toBe("We has 99 ninja fight");
    });
})
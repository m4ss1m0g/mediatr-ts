/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import {
    Mediator,
    RequestHandler,
    requestHandler,
} from "@/index.js";
import { injectable, Container, inject } from "inversify";
import Resolver, { Class } from "@/interfaces/iresolver"
import RequestBase from "@/models/request.js";
import { typeMappings } from "@/models/mappings.js";

describe("Resolver with inversify", () => {
    beforeEach(()=>{
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    test("Should resolve own instances", () => {
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

        const c = new Container();
        c.bind<IWarrior>(TYPES.IWarrior).to(Ninja);

        const ninja = c.get<IWarrior>(TYPES.IWarrior);
        expect(ninja.fight()).toBe("ninja fight");
    });

    test("Should resolve the handler and inject inversify interfaces", async () => {
        /**
         *  Arrange
         */

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

        const container = new Container();
        container.bind<IWarrior>(TYPES.IWarrior).to(Ninja);

        class InversifyResolver implements Resolver {
            resolve<T>(type: Class<T>): T {
                return container.get(type);
            }
    
            add<T>(type: Class<T>): void {
                container.bind(type).toSelf();
            }
        }

        /**
         *  Act
         */
        class Request extends RequestBase<string> {
            constructor(
                public readonly thenumber: number
            ) {
                super();
            }
        }

        @requestHandler(Request)
        @injectable()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerRequest implements RequestHandler<Request, string> {
            @inject(TYPES.IWarrior)
            public warrior?: IWarrior;

            public handle(value: Request): Promise<string> {
                return Promise.resolve(`We has ${value.thenumber} ${this.warrior?.fight()}`);
            }
        }

        const mediator = new Mediator({
            resolver: new InversifyResolver()
        });
        const result = await mediator.send<string>(new Request(99));

        expect(result).toBe("We has 99 ninja fight");
    });
});

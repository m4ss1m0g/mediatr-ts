import { Handler, HandlerSettings } from "@/attribute";
import IRequest from "@/irequest";
import IRequestHandler from "@/irequesthandler";
import Mediator from "@/mediator";
import { injectable, Container } from "inversify";
import "reflect-metadata";

describe("Inversify", () => {
    test("Foo", () => {
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

    test("Bar", async () => {
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

        // -------------
        HandlerSettings.setContainer(c);

        class Request implements IRequest<number> {
            public thenumber: number;
            constructor(thenumber: number) {
                this.thenumber = thenumber;
            }
        }

        @Handler(Request)
        @injectable()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerRequest implements IRequestHandler<Request, string> {
            public handle(value: Request): Promise<string> {
                return Promise.resolve(`Value passed ${value.thenumber}`);
            }
        }

        const mediator = new Mediator(c);
        const result = await mediator.send<number>(new Request(99));

        expect(result).toBe("Value passed 99");
    });
});

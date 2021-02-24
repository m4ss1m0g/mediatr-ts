/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { Mediator, Handler, IRequestHandler, IResolver, mediatorSettings, IRequest } from "@/index";
import { injectable, Container, inject } from "inversify";

describe("Resolver with inversify", () => {
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

        const c = new Container();
        c.bind<IWarrior>(TYPES.IWarrior).to(Ninja);

        class InversifyResolver implements IResolver {
            remove(name: string): void {
                c.unbind(name);
            }
            clear(): void {
                c.unbindAll();
            }
            resolve<Input, Output>(name: string): IRequestHandler<IRequest<Input>, Output> {
                const fx: IRequestHandler<IRequest<Input>, Output> = c.get(name);
                return fx;
            }
            add(name: string, instance: Function): void {
                c.bind(name).to(instance as any);
            }
        }

        /**
         *  Act
         */

        // Settings the resolver with Inversify
        mediatorSettings.resolver = new InversifyResolver();

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
            @inject(TYPES.IWarrior)
            public warrior: IWarrior;

            public handle(value: Request): Promise<string> {
                return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
            }
        }

        const mediator = new Mediator();
        const result = await mediator.send<string>(new Request(99));

        expect(result).toBe("We has 99 ninja fight");
    });
});

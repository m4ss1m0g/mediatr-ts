/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import { Container, inject, injectable } from "inversify";
import RequestBase from "@/models/request.js";
import Resolver from "@/models/resolver.js";
import { default as ResolverInterface } from "@/interfaces/iresolver";
import { Mediator, RequestHandler, requestHandler } from "@/index.js";


describe("The full example", () => {

    const container = new Container();

    // inversify.resolver.ts -> Implement the resolver
    class InversifyResolver implements ResolverInterface {
        resolve<T>(name: string): T {
            return container.get(name);
        }

        add(name: string, instance: Function): void {
            container.bind(name).to(instance as never);
        }

        remove(name: string): void {
            // not necessary- can be blank, never called by the lib, for debugging / testing only
            container.unbind(name);
        }

        clear(): void {
            // not necessary- can be blank, never called by the lib, for debugging / testing only
            container.unbindAll();
        }
    }

    // Set the resolver of MediatR-TS
    Resolver.instance = new InversifyResolver();

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
    class Request extends RequestBase<string> {
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

    test("Should resolve existing instance", async () => {
        const mediator = new Mediator();
        const result = await mediator.send(new Request(99));

        expect(result).toBe("We has 99 ninja fight");
    });
})
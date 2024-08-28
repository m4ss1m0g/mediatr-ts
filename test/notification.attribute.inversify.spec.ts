/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import {
    Mediator,
    NotificationHandler,
    notificationHandler,
} from "@/index.js";
import { injectable, Container, inject } from "inversify";
import { default as ResolverInterface } from "@/interfaces/iresolver"
import Resolver from "@/models/resolver.js";
import Dispatcher from "@/models/dispatcher/index.js";
import NotificationBase from "@/models/notification.js";

describe("Notification with inversify", () => {
    beforeEach(() => {
        Resolver.instance = new Resolver();
        Dispatcher.instance = new Dispatcher(Resolver.instance);
    });

    test("Should resolve the notification and inject inversify interfaces", async () => {
        let result = "";

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

        class Ping extends NotificationBase {
            public thenumber: number;

            constructor(thenumber: number) {
                super();
                this.thenumber = thenumber;
            }
        }

        class InversifyResolver implements ResolverInterface {
            remove(name: string): void {
                container.unbind(name);
            }
            clear(): void {
                container.unbindAll();
            }
            resolve<T>(name: string): T {
                const fx: any = container.get(name);
                return fx;
            }
            add(name: string, instance: Function): void {
                container.bind(name).to(instance as any);
            }
        }

        Resolver.instance = new InversifyResolver();
        Dispatcher.instance = new Dispatcher(Resolver.instance);

        @notificationHandler(Ping)
        @injectable()
        class Foo implements NotificationHandler<Ping> {
            @inject(TYPES.IWarrior)
            public warrior?: IWarrior;

            async handle(value: Ping): Promise<void> {
                result = "We has " + value.thenumber + " " + this.warrior?.fight();
            }
        }

        const mediator = new Mediator();
        await mediator.publish(new Ping(99));

        expect(result).toBe("We has 99 ninja fight");
    });
});

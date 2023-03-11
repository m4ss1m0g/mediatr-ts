/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import {
    Mediator,
    IResolver,
    mediatorSettings,
    INotification,
    notificationHandler,
    INotificationHandler,
} from "@/index";
import { injectable, Container, inject } from "inversify";

describe("Notification with inversify", () => {
    beforeEach(() => {
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.notifications.clear();
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

        const c = new Container();
        c.bind<IWarrior>(TYPES.IWarrior).to(Ninja);

        class Ping implements INotification {
            public thenumber: number;

            constructor(thenumber: number) {
                this.thenumber = thenumber;
            }
        }

        class InversifyResolver implements IResolver {
            remove(name: string): void {
                c.unbind(name);
            }
            clear(): void {
                c.unbindAll();
            }
            resolve<T>(name: string): T {
                const fx: any = c.get(name);
                return fx;
            }
            add(name: string, instance: Function): void {
                c.bind(name).to(instance as any);
            }
        }

        // Settings the resolver with Inversify
        mediatorSettings.resolver = new InversifyResolver();

        @notificationHandler(Ping)
        @injectable()
        class Foo implements INotificationHandler<Ping> {
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

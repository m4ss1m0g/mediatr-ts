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
import Resolver, { Class } from "@/interfaces/iresolver";
import NotificationBase from "@/models/notification.js";
import { typeMappings } from "@/models/mappings.js";

describe("Notification with inversify", () => {
    beforeEach(() => {
        typeMappings.behaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
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

        class InversifyResolver implements Resolver {
            resolve<T>(type: Class<T>): T {
                return container.get(type);
            }
    
            add<T>(type: Class<T>): void {
                container.bind(type).toSelf();
            }
        }

        @notificationHandler(Ping)
        @injectable()
        class Foo implements NotificationHandler<Ping> {
            @inject(TYPES.IWarrior)
            public warrior?: IWarrior;

            async handle(value: Ping): Promise<void> {
                result = "We has " + value.thenumber + " " + this.warrior?.fight();
            }
        }

        const mediator = new Mediator({
            resolver: new InversifyResolver(),
        });
        await mediator.publish(new Ping(99));

        expect(result).toBe("We has 99 ninja fight");
    });
});

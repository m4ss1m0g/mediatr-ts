/* eslint-disable @typescript-eslint/no-unused-vars */
import NotificationHandler, { NotificationHandlerClass } from "@/interfaces/inotification.handler";
import PipelineBehavior, { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";
import RequestBase from "@/models/request.js";
import NotificationBase from "@/models/notification.js";
import { typeMappings } from "@/models/mappings/index.js";

describe("The internal dispatcher", () => {
    beforeEach(() => {
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    test("Should setOrder on dispatcher notifications", () => {
        // Arrange
        class Ping extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Pong1 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        class Pong2 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        class Foo extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Bar implements NotificationHandler<Foo> {
            handle(_notification: Foo): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        // Act
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 22 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong2, order: 33 });

        const a: NotificationHandlerClass<unknown>[] = [Pong1, Pong2];
        typeMappings.notifications.setOrder(Ping, a);

        // Assert
        const items = typeMappings.notifications.getAll(Ping);

        expect(items[0].order).toBe(1);
        expect(items[0].handlerClass).toBe(Pong2);

        expect(items[1].order).toBe(0);
        expect(items[1].handlerClass).toBe(Pong1);

        expect(items.length).toBe(2);
    });

    test("Should setOrder on dispatcher behaviout", () => {
        // Arrange
        class PipelineBehaviorTest1 implements PipelineBehavior {
            async handle(request: RequestBase<unknown>, next: () => unknown): Promise<unknown> {
                return await next();
            }
        }

        class PipelineBehaviorTest2 implements PipelineBehavior {
            async handle(request: RequestBase<unknown>, next: () => unknown): Promise<unknown> {
                return await next();
            }
        }

        const b1 = PipelineBehaviorTest1 as PipelineBehaviorClass;
        const b2 = PipelineBehaviorTest2 as PipelineBehaviorClass;

        // Act
        typeMappings.pipelineBehaviors.add({ behaviorClass: b2, order: 33 });
        typeMappings.pipelineBehaviors.add({ behaviorClass: b1, order: 22 });

        const a: PipelineBehaviorClass[] = [b1, b2];
        typeMappings.pipelineBehaviors.setOrder(a);

        // Assert
        const items = typeMappings.pipelineBehaviors.getAll();

        expect(items[0].order).toBe(1);
        expect(items[0].behaviorClass).toBe(b2);

        expect(items[1].order).toBe(0);
        expect(items[1].behaviorClass).toBe(b1);

        expect(items.length).toBe(2);
    });

    test("Should add a new DispatchInstance to the container", () => {
        // Arrange
        class Ping extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Pong1 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        // Act
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 1 });

        // Assert
        const items = typeMappings.notifications.getAll(Ping);
        expect(items.length).toBe(1);
    });

    test("Should clear all instances from the container", () => {
        // Arrange
        class Ping extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Pong1 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        class Pong2 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 1 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong2, order: 2 });

        // Act
        typeMappings.notifications.clear();

        // Assert
        const fx = () => typeMappings.notifications.getAll(Ping);
        expect(fx).toThrowError();
    });

    test("Should throw error when it doesn't find the event", () => {
        // Arrange
        class Ping extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        // Assert
        const fx = () => typeMappings.notifications.getAll(Ping);
        expect(fx).toThrowError();
    });

    test("Should get specified number of instances from the container", () => {
        // Arrange
        class Ping extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Pong1 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        class Pong2 implements NotificationHandler<Ping> {
            handle(_notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        class Foo extends NotificationBase {
            constructor(public value: string) { super(); }
        }

        class Bar implements NotificationHandler<Foo> {
            handle(_notification: Foo): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        // Act
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 1 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong2, order: 2 });
        typeMappings.notifications.add({ notificationClass: Foo, handlerClass: Bar, order: 1 });

        // Assert
        const items = typeMappings.notifications.getAll(Ping);
        expect(items.length).toBe(2);
    });
});

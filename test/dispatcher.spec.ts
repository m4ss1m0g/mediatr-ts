/* eslint-disable @typescript-eslint/no-unused-vars */
import NotificationHandler, { NotificationHandlerClass } from "@/interfaces/inotification.handler";
import PipelineBehavior, { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";
import RequestBase from "@/models/request.js";
import Dispatcher from "@/models/dispatcher/index.js";
import Resolver from "@/models/resolver.js";
import NotificationBase from "@/models/notification.js";

describe("The internal dispatcher", () => {
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

    class Pang extends NotificationBase {
        constructor(public value: string) { super(); }
    }

    class Pang1 implements NotificationHandler<Pang> {
        handle(_notification: Pang): Promise<void> {
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

    beforeEach(() => {
        Resolver.instance.clear();
        Dispatcher.instance.notifications.clear();
    });

    test("Should setOrder on dispatcher notifications", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 22 });
        d.notifications.add({ notification: Ping, handler: Pong2, order: 33 });

        const a: NotificationHandlerClass<unknown>[] = [Pong1, Pong2];
        d.notifications.setOrder(Ping, a);

        // Assert
        const items = d.notifications.getAll(Ping);

        expect(items[0].order).toBe(1);
        expect(items[0].handler).toBe(Pong2);

        expect(items[1].order).toBe(0);
        expect(items[1].handler).toBe(Pong1);

        expect(items.length).toBe(2);
    });

    test("Should setOrder on dispatcher behaviout", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());

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
        d.behaviors.add({ behavior: b2, order: 33 });
        d.behaviors.add({ behavior: b1, order: 22 });

        const a: PipelineBehaviorClass[] = [b1, b2];
        d.behaviors.setOrder(a);

        // Assert
        const items = d.behaviors.getAll();

        expect(items[0].order).toBe(1);
        expect(items[0].behavior).toBe(b2);

        expect(items[1].order).toBe(0);
        expect(items[1].behavior).toBe(b1);

        expect(items.length).toBe(2);
    });

    test("Should add a new DispatchInstance to the container", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 });

        // Assert
        const items = d.notifications.getAll(Ping);
        expect(items.length).toBe(1);
    });

    test("Should clear all instances from the container", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 });
        d.notifications.add({ notification: Ping, handler: Pong2, order: 2 });

        // Act
        d.notifications.clear();

        // Assert
        const fx = () => d.notifications.getAll(Ping);
        expect(fx).toThrowError();
    });

    test("Should throw error when it doesn't find the event", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());

        // Assert
        const fx = () => d.notifications.getAll(Ping);
        expect(fx).toThrowError();
    });

    test("Should get specified number of instances from the container", () => {
        // Arrange
        const d = new Dispatcher(new Resolver());

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 });
        d.notifications.add({ notification: Ping, handler: Pong2, order: 2 });
        d.notifications.add({ notification: Foo, handler: Bar, order: 1 });

        // Assert
        const items = d.notifications.getAll(Ping);
        expect(items.length).toBe(2);
    });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { INotification, INotificationHandler, IRequest } from "@/index.js";
import { mediatorSettings } from "@/index.js";
import { INotificationHandlerClass } from "@/interfaces/inotification.handler";
import IPipelineBehavior, { IPipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";
import Dispatcher from "@/models/dispatcher/index.js";

describe("The internal dispatcher", () => {
    class Ping implements INotification {
        constructor(public value: string) {}
    }

    class Pong1 implements INotificationHandler<Ping> {
        handle(_notification: Ping): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    class Pong2 implements INotificationHandler<Ping> {
        handle(_notification: Ping): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    class Pang implements INotification {
        constructor(public value: string) {}
    }

    class Pang1 implements INotificationHandler<Pang> {
        handle(_notification: Pang): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    class Foo implements INotification {
        constructor(public value: string) {}
    }

    class Bar implements INotificationHandler<Foo> {
        handle(_notification: Foo): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    beforeEach(() => {
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.notifications.clear();
    });

    test("Should setOrder on dispatcher notifications", () => {
        // Arrange
        const d = new Dispatcher();

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 22 });
        d.notifications.add({ notification: Ping, handler: Pong2, order: 33 });

        const a: INotificationHandlerClass<unknown>[] = [Pong1, Pong2];
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
        const d = new Dispatcher();

        class PipelineBehaviorTest1 implements IPipelineBehavior {
            async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
                return await next();
            }
        }

        class PipelineBehaviorTest2 implements IPipelineBehavior {
            async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
                return await next();
            }
        }

        const b1 = PipelineBehaviorTest1 as IPipelineBehaviorClass;
        const b2 = PipelineBehaviorTest2 as IPipelineBehaviorClass;

        // Act
        d.behaviors.add({ behavior: b2, order: 33 });
        d.behaviors.add({ behavior: b1, order: 22 });

        const a: IPipelineBehaviorClass[] = [b1, b2];
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
        const d = new Dispatcher();

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 });

        // Assert
        const items = d.notifications.getAll(Ping);
        expect(items.length).toBe(1);
    });

    test("Should clear all instances from the container", () => {
        // Arrange
        const d = new Dispatcher();
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
        const d = new Dispatcher();

        // Assert
        const fx = () => d.notifications.getAll(Ping);
        expect(fx).toThrowError();
    });

    test("Should get specified number of instances from the container", () => {
        // Arrange
        const d = new Dispatcher();

        // Act
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 });
        d.notifications.add({ notification: Ping, handler: Pong2, order: 2 });
        d.notifications.add({ notification: Foo, handler: Bar, order: 1 });

        // Assert
        const items = d.notifications.getAll(Ping);
        expect(items.length).toBe(2);
    });
});

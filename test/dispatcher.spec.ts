/* eslint-disable @typescript-eslint/no-unused-vars */
import type { INotification, INotificationHandler } from "@/index";
import { mediatorSettings } from "@/index";
import Dispatcher from "@/models/dispatcher";

describe("The internal dispatcher", () => {
    class Ping implements INotification {
        constructor(public value: string){}
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
        constructor(public value: string){}
    }

    class Pang1 implements INotificationHandler<Pang> {
        handle(_notification: Pang): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    class Foo implements INotification {
        constructor(public value: string){}
    }

    class Bar implements INotificationHandler<Foo> {
        handle(_notification: Foo): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    beforeEach(()=>{
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.notifications.clear();
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
        d.notifications.add({ notification: Ping, handler: Pong1, order: 1 })
        d.notifications.add({ notification: Ping, handler: Pong2, order: 2 });
        d.notifications.add({ notification: Foo, handler: Bar, order: 1 });

        // Assert
        const items = d.notifications.getAll(Ping);
        expect(items.length).toBe(2);
    });
});

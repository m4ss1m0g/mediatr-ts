/* eslint-disable @typescript-eslint/no-unused-vars */
import type Notification from "@/models/notification.js";
import notificationHandler from "@/attributes/notification.attribute.js";
import type NotificationHandler from "@/interfaces/inotification.handler.js";
import { Mediator } from "@/index.js";
import Resolver from "@/models/resolver.js";
import Dispatcher from "@/models/dispatcher/index.js";

describe("The notification attribute", () => {
    class Ping implements Notification {
        constructor(public value: string){}
    }

    beforeEach(()=>{
        Resolver.instance = new Resolver();
        Dispatcher.instance = new Dispatcher(Resolver.instance);
    });

    test("Should add instance to dispatcher and resolver", () => {
        // Arrange
        const spyDispatcher = jest.spyOn(Dispatcher.instance.notifications, "add");
        const spyResolver = jest.spyOn(Resolver.instance, "add");

        // Act
        @notificationHandler(Ping)
        class Pong1 implements NotificationHandler<Ping> {
            handle(notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        // Assert
        expect(spyDispatcher).toBeCalledTimes(1);
        expect(spyResolver).toBeCalledTimes(1);

        jest.clearAllMocks();
    });

    test("Should resolve and call the notification", () => {
        // Arrange
        const result: string[] = [];
        const message = "foo";

        @notificationHandler(Ping)
        class Pong1 implements NotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value);
            }
        }

        // Act
        const mediator = new Mediator();
        mediator.publish(new Ping(message));

        // Assert
        expect(result.length).toBe(1);
        expect(result[0]).toBe(message);
    });

    test("Should resolve and call the notification in specific order when", () => {
        // Arrange
        const result: string[] = [];
        const message1 = "foo1";

        class Pong2 implements NotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_2");
            }
        }

        class Pong1 implements NotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_1");
            }
        }

        Dispatcher.instance.notifications.add({ notification: Ping, handler: Pong2, order: 2 });
        Dispatcher.instance.notifications.add({ notification: Ping, handler: Pong1, order: 1 });
        
        // Act
        const mediator = new Mediator();
        mediator.publish(new Ping(message1));

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(message1 + "_1");
        expect(result[1]).toBe(message1 + "_2");
    });

    test("Should resolve all notification without order field", ()=>{
        // Arrange
        const result: string[] = [];
        const message = "foo";

        @notificationHandler(Ping)
        class Pong1 implements NotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value);
            }
        }

        @notificationHandler(Ping)
        class Pong2 implements NotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value);
            }
        }

        // Act
        const mediator = new Mediator();
        mediator.publish(new Ping(message));

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(message);
        expect(result[1]).toBe(message);
    });
});

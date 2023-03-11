/* eslint-disable @typescript-eslint/no-unused-vars */
import type INotification from "@/interfaces/inotification";
import notificationHandler from "@/attributes/notification.attribute";
import type INotificationHandler from "@/interfaces/inotification.handler";
import { Mediator, mediatorSettings } from "@/index";

describe("The notification attribute", () => {
    class Ping implements INotification {
        constructor(public value: string){}
    }

    beforeEach(()=>{
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.notifications.clear();
    });

    test("Should add instance to dispatcher and resolver", () => {
        // Arrange
        const spyDispatcher = jest.spyOn(mediatorSettings.dispatcher.notifications, "add");
        const spyResolver = jest.spyOn(mediatorSettings.resolver, "add");

        // Act
        @notificationHandler(Ping)
        class Pong1 implements INotificationHandler<Ping> {
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
        class Pong1 implements INotificationHandler<Ping> {

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

        class Pong2 implements INotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_2");
            }
        }

        class Pong1 implements INotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_1");
            }
        }

        mediatorSettings.dispatcher.notifications.add({ notification: Ping, handler: Pong2, order: 2 });
        mediatorSettings.dispatcher.notifications.add({ notification: Ping, handler: Pong1, order: 1 });
        
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
        class Pong1 implements INotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value);
            }
        }

        @notificationHandler(Ping)
        class Pong2 implements INotificationHandler<Ping> {

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

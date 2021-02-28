/* eslint-disable @typescript-eslint/no-unused-vars */
import INotification from "@/interfaces/inotification";
import NotificationHandler from "@/attributes/notification.attribute";
import INotificationHandler from "@/interfaces/inotification.handler";
import { Mediator, mediatorSettings } from "@/index";

describe("The notification attribute", () => {
    class Ping implements INotification {
        constructor(public value?: string){}
    }

    beforeEach(()=>{
        mediatorSettings.resolver.clear();
        mediatorSettings.dispatcher.clear();
    });

    test("Should add instance to dispatcher and resolver", () => {
        // Arrange
        const spyDispatcher = jest.spyOn(mediatorSettings.dispatcher, "add");
        const spyResolver = jest.spyOn(mediatorSettings.resolver, "add");

        // Act
        @NotificationHandler(Ping, 1)
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

        @NotificationHandler(Ping, 1)
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

    test("Should resolve and call the notification in specific order", () => {
        // Arrange
        const result: string[] = [];
        const message1 = "foo1";

        @NotificationHandler(Ping, 2)
        class Pong2 implements INotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_2");
            }
        }

        @NotificationHandler(Ping, 1)
        class Pong1 implements INotificationHandler<Ping> {

            async handle(notification: Ping): Promise<void> {
                result.push(notification.value + "_1");
            }
        }

        // Act
        const mediator = new Mediator();
        mediator.publish(new Ping(message1));

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(message1 + "_1");
        expect(result[1]).toBe(message1 + "_2");
    });
});

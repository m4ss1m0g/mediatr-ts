/* eslint-disable @typescript-eslint/no-unused-vars */
import type Notification from "@/models/notificationData.js";
import notificationHandler from "@/attributes/notificationHandler.attribute.js";
import type NotificationHandler from "@/interfaces/notificationHandler.js";
import { Mediator } from "@/index.js";
import { typeMappings } from "@/models/mappings/index.js";
import { OrderedMappings } from "@/models/mappings/orderedMappings.js";
import PublishError from "@/errors/publish-error.js";

describe("The notification attribute", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    });

    class Ping implements Notification {
        constructor(public value: string) {}
    }

    test("Should add instance to dispatcher and resolver", () => {
        // Arrange
        const spyDispatcher = jest.spyOn(typeMappings.notifications, "add");

        // Act
        @notificationHandler(Ping)
        class Pong1 implements NotificationHandler<Ping> {
            handle(notification: Ping): Promise<void> {
                throw new Error("Method not implemented.");
            }
        }

        // Assert
        expect(spyDispatcher).toBeCalledTimes(1);
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
        const notifications = mediator.notifications as unknown as OrderedMappings;
        expect(notifications.length).toBe(1);
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

        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong2, order: 2 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 1 });

        // Act
        const mediator = new Mediator();
        mediator.publish(new Ping(message1));

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(message1 + "_1");
        expect(result[1]).toBe(message1 + "_2");
    });

    test("Should resolve all notification without order field", () => {
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

    test("Should execute all notifications regardless of outcome", async () => {
        // Arrange
        const result: string[] = [];
        const message1 = "foo1";

        class Pong1 implements NotificationHandler<Ping> {
            async handle(notification: Ping): Promise<void> {
                await new Promise((resolve, _) => {
                    setTimeout(resolve, 550);
                });
                result.push(notification.value + "_1");
            }
        }

        class Pong2 implements NotificationHandler<Ping> {
            async handle(notification: Ping): Promise<void> {
                await new Promise((resolve, _) => {
                    setTimeout(resolve, 500);
                });
                result.push(notification.value + "_2");
            }
        }

        class Pong3 implements NotificationHandler<Ping> {
            async handle(notification: Ping): Promise<void> {
                await new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error("error"));
                    }, 200);
                });
            }
        }

        // reverse order
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong1, order: 1 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong2, order: 2 });
        typeMappings.notifications.add({ notificationClass: Ping, handlerClass: Pong3, order: 3 });

        // Act
        const mediator = new Mediator();
        try {
            await mediator.publish(new Ping(message1));
            fail("Should throw error");
        } catch (error) {
            expect(error).toBeInstanceOf(PublishError);
            const err = error as PublishError;
            expect(err.results.length).toBe(3);
        }

        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(message1 + "_2"); // reverse order ;-)
        expect(result[1]).toBe(message1 + "_1");
    });
});

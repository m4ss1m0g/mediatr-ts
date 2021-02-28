import Dispatcher from "@/models/dispatcher";
import DispatcherInstance from "@/models/dispatch.instance";

describe("The internal dispatcher", () => {
    test("Should add a new DispatchInstance to the container", () => {
        // Arrange
        const d = new Dispatcher();

        // Act
        d.add(new DispatcherInstance("Ping", "Pong1", 1));

        // Assert
        const items = d.getAll("Ping");
        expect(items.length).toBe(1);
    });

    test("Should remove all events from the dispatcher container", () => {
        // Arrange
        const d = new Dispatcher();
        d.add(new DispatcherInstance("Ping", "Pong1", 1));
        d.add(new DispatcherInstance("Ping", "Pong2", 2));

        d.add(new DispatcherInstance("Pang", "Pang1", 1));

        // Act
        d.remove("Ping");

        // Assert
        const itemsPang = d.getAll("Pang");
        expect(itemsPang.length).toBe(1);

        const fx = () => d.getAll("Ping");
        expect(fx).toThrowError();
    });

    test("Should clear all instances from the container", () => {
        // Arrange
        const d = new Dispatcher();
        d.add(new DispatcherInstance("Ping", "Pong1", 1));
        d.add(new DispatcherInstance("Ping", "Pong2", 2));

        // Act
        d.clear();

        // Assert
        const fx = () => d.getAll("Ping");
        expect(fx).toThrowError();
    });

    test("Should throw error when it doesn't find the event", () => {
        // Arrange
        const d = new Dispatcher();

        // Assert
        const fx = () => d.getAll("Not existing class");
        expect(fx).toThrowError();
    });

    test("Should get specified number of instances from the container", () => {
        // Arrange
        const d = new Dispatcher();

        // Act
        d.add(new DispatcherInstance("Ping", "Pong1", 1));
        d.add(new DispatcherInstance("Ping", "Pong2", 2));
        d.add(new DispatcherInstance("Foo", "Bar", 1));

        // Assert
        const items = d.getAll("Ping");
        expect(items.length).toBe(2);
    });
});

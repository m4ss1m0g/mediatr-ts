import container from "@/container";

/**
 * the anonymous function is required because expect(x).toThrow()
 * requires x to be a reference to a function that throws.
 * If you instead pass expect(x()).toThrow(), JavaScript will resolve x(),
 * which would likely cause the error immediately, and most likely fail your tes
 *
 * https://stackoverflow.com/questions/46042613/how-to-test-the-type-of-a-thrown-exception-in-jest
 */

describe("Container", () => {
    
    test("Container is already created", () => {
        expect(container).not.toBeUndefined();
    });

    test("Can add a new function", () => {
        container.clear();
        const fx = (): string => {
            return "foo";
        };
        container.add("k1", fx);
    });

    test("Cannot add an existing function", () => {
        container.clear();
        const fx = (): string => {
            return "foo";
        };
        container.add("k1", fx);

        const f = ()=> container.add("k1", fx);
        expect(f).toThrowError();
    });


    test("Can get an existing function", () => {
        container.clear();

        const fx = (): string => {
            return "foo";
        };
        container.add("k1", fx);

        const rfx = container.resolve("k1");
        expect(rfx).not.toBeUndefined();
        expect(rfx()).toBe("foo");
    });

    test("Can remove an existing function", () => {
        container.clear();

        const fx = (): string => {
            return "foo";
        };

        container.add("k1", fx);
        container.add("k2", fx);
        container.add("k3", fx);

        container.remove("k1");

        const f = () => container.resolve("k1");
        expect(f).toThrowError();
        expect(container.resolve("k2")).not.toBeUndefined();
    });

    test("Can clear the container", () => {
        container.clear();

        const fx = (): string => {
            return "foo";
        };

        container.add("k1", fx);
        container.add("k2", fx);

        container.clear();

        const f1 = () => container.resolve("k1");
        const f2 = () => container.resolve("k2");
        expect(f1).toThrow();
        expect(f2).toThrow();
    });
});

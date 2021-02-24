import Resolver from "@/models/resolver";
import settings from "@/settings";

/**
 * the anonymous function is required because expect(x).toThrow()
 * requires x to be a reference to a function that throws.
 * If you instead pass expect(x()).toThrow(), JavaScript will resolve x(),
 * which would likely cause the error immediately, and most likely fail your tes
 *
 * https://stackoverflow.com/questions/46042613/how-to-test-the-type-of-a-thrown-exception-in-jest
 */

describe("The internal resolver", () => {
    
    test("The resolver is already instantiated at startup", () => {
        expect(settings.resolver).not.toBeUndefined();
    });

    test("Should add a new instance to the resolver", () => {
        const r = new Resolver();

        const fx = (): string => {
            return "foo";
        };

        r.add("k1", fx);
    });

    test("Should not add an existing instance", () => {
        const r = new Resolver();

        const fx = (): string => {
            return "foo";
        };
        r.add("k1", fx);

        const f = ()=> r.add("k1", fx);
        expect(f).toThrowError();
    });


    test("Should get an existing instance", () => {
        const r = new Resolver();

        const fx = (): string => {
            return "foo";
        };
        r.add("k1", fx);

        const rfx = r.resolve("k1");
        expect(rfx).not.toBeUndefined();
    });

    test("Should remove an existing instance", () => {
        const r = new Resolver();

        const fx = (): string => {
            return "foo";
        };

        r.add("k1", fx);
        r.add("k2", fx);
        r.add("k3", fx);

        r.remove("k1");

        const f = () => r.resolve("k1");
        expect(f).toThrowError();
        expect(r.resolve("k2")).not.toBeUndefined();
    });

    test("Should clear the resolver", () => {
        const r = new Resolver();

        const fx = (): string => {
            return "foo";
        };

        r.add("k1", fx);
        r.add("k2", fx);

        r.clear();

        const f1 = () => r.resolve("k1");
        const f2 = () => r.resolve("k2");
        expect(f1).toThrow();
        expect(f2).toThrow();
    });
});

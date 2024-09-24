/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { OrderedMappings } from "@/models/mappings/orderedMappings.js";

describe("The internal ordered mapping", () => {
    type Data = {
        value: string;
    };

    class OrderedStrings extends OrderedMappings<Data> {
        public get elements(): Data[] {
            return this._mappings;
        }
    }

    test("Should create an ordered mapping and add elements to it", () => {
        const o = new OrderedStrings();
        o.add({ value: "foo" });
        o.add({ value: "bar" });

        const e = o.elements;
        expect(e.length).toBe(2);
        expect(e[0].value).toBe("foo");
        expect(e[1].value).toBe("bar");

    });

    test("Should clear an ordered mapping list", () => {
        const o = new OrderedStrings();
        o.add({ value: "foo" });
        o.add({ value: "bar" });

        o.clear();

        expect(o.length).toBe(0);
    });
});

import Handler from "@/attribute";
import container from "@/container";

describe("Handler tests", () => {

    test("Attach the attribute add the entry to the container", () => {
        container.clear();
        class Request {}

        @Handler(Request)
        class HandlerTest {}

        const i = new HandlerTest();
        const fx = container.resolve("Request");

        expect(fx).not.toBeUndefined();
        expect(i).not.toBeUndefined();
    });
    
});

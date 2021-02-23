import Handler from "@/attribute";
import IRequest from "@/irequest";
import IRequestHandler from "@/irequesthandler";
import Mediator from "@/mediator";

describe("Mediator class", () => {
    test("Can send a valid command to mediator", async () => {
        class Request implements IRequest<number> {
            public thenumber: number;
            constructor(thenumber: number){
                this.thenumber = thenumber;
            }
        }

        @Handler(Request)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class HandlerRequest implements IRequestHandler<Request, string> {
            public handle(value: Request): Promise<string> {
                return Promise.resolve(`Value passed ${value.thenumber}`);
            }
        }

        const mediator = new Mediator();
        const result = await mediator.send<number>(new Request(99));

        expect(result).toBe("Value passed 99");
    });
});

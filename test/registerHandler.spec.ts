import "reflect-metadata";
import { Container, inject, injectable } from "inversify";
import RequestData from "@/models/requestData.js";
import { Handler, Mediator, RequestHandler, requestHandler, Resolver } from "@/index.js";
import { Class } from "@/interfaces/resolver";
import { typeMappings } from "@/models/mappings/index.js";
import { throws } from "node:assert";



describe("manual handler register", () => {

    beforeEach(() => {
        typeMappings.pipelineBehaviors.clear();
        typeMappings.notifications.clear();
        typeMappings.requestHandlers.clear();
    })


    test("Should register handler manually", async () => {
        
               const container = new Container();
           
               // inversify.resolver.ts -> Implement the resolver
               class InversifyResolver implements Resolver {
                   resolve<T>(type: Class<T>): T {
                       return container.get(type);
                   }
           
                   add<T>(type: Class<T>): void {
                       container.bind(type).toSelf();
                   }
               }
           
               // You can later configure the inversify container
               interface IWarrior {
                   fight(): string;
               }
           
               const TYPES = {
                   IWarrior: Symbol.for("IWarrior"),
               };
           
               @injectable()
               class Ninja implements IWarrior {
                   fight(): string {
                       return "ninja fight";
                   }
               }
           
               container.bind<IWarrior>(TYPES.IWarrior).to(Ninja);
           
               // The request object
               class Request extends RequestData<string> {
                   constructor(
                       public readonly thenumber: number
                   ) {
                       super();
                   }
               }
           
               // Decorate the handler request with Handler and injectable attribute, notice the warrior property
               @injectable()
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               class HandlerRequest implements RequestHandler<Request, string> {
                   @inject(TYPES.IWarrior)
                   public warrior!: IWarrior; // Instantiated by the inversify
           
                   public handle(value: Request): Promise<string> {
                       return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
                   }
               }

              
               const mediator = new Mediator({
                   resolver: new InversifyResolver()
               });

            
               mediator.registerHandler(Request, HandlerRequest)
               const result = await mediator.send(new Request(99));
       
               expect(result).toBe("We has 99 ninja fight");
    })


    test("should throw on registering handler more than once", async () => {
         
               // The request object
               class Request extends RequestData<void> {  }
           
               // Decorate the handler request with Handler and injectable attribute, notice the warrior property
               @injectable()
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               class HandlerRequest implements RequestHandler<Request, void> {
                   public async handle(value: Request): Promise<void> { }
               }

               const mediator = new Mediator();

               mediator.registerHandler(Request, HandlerRequest)
               
               throws(() =>  mediator.registerHandler(Request, HandlerRequest) )
            
    })



        test("should throw on registering decorated handler", async () => {
         
               // The request object
               class Request extends RequestData<void> {  }
           
               // Decorate the handler request with Handler and injectable attribute, notice the warrior property
               @injectable()
               @requestHandler(Request)
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               class HandlerRequest implements RequestHandler<Request, void> {
                   public async handle(value: Request): Promise<void> { }
               }

               const mediator = new Mediator();

               
               throws(() =>  mediator.registerHandler(Request, HandlerRequest) )
            
    })
})
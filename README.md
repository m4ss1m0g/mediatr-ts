# MediatR-TS

![npm type definitions](https://img.shields.io/npm/types/mediatr-ts)
![npm](https://img.shields.io/npm/v/mediatr-ts)
![npm bundle size](https://img.shields.io/bundlephobia/min/mediatr-ts)
![NPM](https://img.shields.io/npm/l/mediatr-ts)  

![coverage stmt](badges/badge-statements.svg)
![coverage fx](badges/badge-functions.svg)
![coverage lines](badges/badge-lines.svg)
![coverage branches](badges/badge-branches.svg)

Porting to typescript of the famous [MediatR](https://github.com/jbogard/MediatR) for C#.
It work out-of-the-box with an internal resolver, however it can be 'plugged in' with dependency injection frameworks like [Inversify](https://inversify.io/).

## Supported concepts

### Request handlers

Below the `requestHandler` pattern with internal resolver and with the inversify library

```typescript
// request.ts -> Define the request
class Request extends RequestData<string> {
    name: string;
}

// handlertest.ts -> Add the attribute to the request handler
@requestHandler(Request)
class HandlerTest implements RequestHandler<Request, string> {
    handle(value: Request): Promise<string> {
        return Promise.resolve(`Value passed ${value.name}`);
    }
}

// main.ts -> Instantiate the mediator 
const mediator = new Mediator();

// Create the request
const r = new Request();
r.name = "Foo";

// Send the command
const result = await mediator.send(r);

// result = "Value passed Foo"
```

### Manual handler registration

If you prefer not to use `requestHandler` decorator, you can register handlers programmatically:

```typescript
// Set up a resolver (e.g., InversifyResolver)
const mediator = new Mediator({ resolver: myResolver });

class Request extends RequestData<string> {
    name: string;
}

class HandlerTest implements RequestHandler<Request, string> {
    handle(value: Request): Promise<string> {
        return Promise.resolve(`Value passed ${value.name}`);
    }
}

// Register manually
mediator.registerHandler(Request, HandlerTest);

await mediator.send(new Request(...));

```
### Notification handlers

```typescript
import { Mediator } from "mediatr-ts";

const result: string[] = [];

// The notification class
class Ping extends NotificationData {
    constructor(public value?: string){ super(); }
}

// The notification handler
@notificationHandler(Ping)
class Pong1 implements NotificationHandler<Ping> {
    async handle(notification: Ping): Promise<void> {
        result.push(notification.value);
    }
}

const mediator = new Mediator();
mediator.publish(new Ping(message));

// result: [ "Foo" ]
```

#### Changing the order of execution

By default, the notification handlers will run in the order that they are loaded in. This might not be desirable, since it depends on the order of the imports. To change the order, you can set it explicitly.

```typescript
import { Mediator, NotificationData, NotificationHandler } from "mediatr-ts";

const result: string[] = [];

// The notification class
class Ping extends NotificationData {
    constructor(public value?: string){}
}

// The notification handler
@notificationHandler(Ping)
class Pong2 implements NotificationHandler<Ping> {
    async handle(notification: Ping): Promise<void> {
        result.push(notification.value + " from 2");
    }
}

// The notification handler
@notificationHandler(Ping)
class Pong1 implements NotificationHandler<Ping> {
    async handle(notification: Ping): Promise<void> {
        result.push(notification.value + " from 1");
    }
}

const mediator = new Mediator();
mediator.publish(new Ping("Foo"));

// result: [ "Foo from 2", "Foo from 1" ]

// Set the order of the pipeline behaviors. PipelineBehaviorTest2 will be executed first, and then PipelineBehaviorTest1.
mediator.dispatcher.notifications.setOrder(Ping, [
    Pong2, 
    Pong1
]);

mediator.publish(new Ping("Foo"));

// result: [ "Foo from 1", "Foo from 2" ]
```

### Pipeline behaviors

```typescript
import { Mediator, PipelineBehavior, RequestHandler, RequestData } from "mediatr-ts";

class Request extends RequestData {
    name?: string;
}

@requestHandler(Request)
class HandlerTest implements RequestHandler<Request, string> {
    handle(value: Request): Promise<string> {
        return Promise.resolve(`Value passed ${value.name}`);
    }
}

@pipelineBehavior()
class PipelineBehaviorTest1 implements PipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        if(request instanceof Request) {
            request.name += " with stuff 1";
        }

        let result = await next();
        if(typeof result === "string") {
            result += " after 1";
        }

        return result;
    }
}

@pipelineBehavior()
class PipelineBehaviorTest2 implements PipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        if(request instanceof Request) {
            request.name += " with stuff 2";
        }

        let result = await next();
        if(typeof result === "string") {
            result += " after 2";
        }

        return result;
    }
}

const r = new Request();
r.name = "Foo";

const mediator = new Mediator();
const result = await mediator.send(r);

// result will be "Value passed Foo with stuff 2 with stuff 1 after 1 after 2"
```

#### Changing the order of execution

By default, the pipeline behaviors will run in the order that they are loaded in. This might not be desirable, since it depends on the order of the imports. To change the order, you can set it explicitly.

```typescript
import { Mediator, PipelineBehavior } from "mediatr-ts";

@pipelineBehavior()
class PipelineBehaviorTest1 implements PipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        return result;
    }
}

@pipelineBehavior()
class PipelineBehaviorTest2 implements PipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        return result;
    }
}

const mediator = new Mediator();
// Set the order of the pipeline behaviors. PipelineBehaviorTest2 will be executed first, and then PipelineBehaviorTest1.
mediator.pipelineBehaviors.setOrder([
    PipelineBehaviorTest2, 
    PipelineBehaviorTest1
]);
```

## Integrating with Dependency Injection containers

### Inversify

At the very beginning of your app you **MUST** setup the resolver with Inversify, or at least **BEFORE** using the `@requestHandler` attribute and/or the `Mediator` class.

```typescript
import { Container } from "inversify";
import { Mediator, Resolver, requestHandler, RequestData } from "mediatr-ts";

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
class Request extends RequestData<number> {
    public thenumber: number;

    constructor(thenumber: number) {
        super();
        this.thenumber = thenumber;
    }
}

// Decorate the handler request with Handler and injectable attribute, notice the warrior property
@requestHandler(Request)
@injectable()
class HandlerRequest implements RequestHandler<Request, string> {
    @inject(TYPES.IWarrior)
    public warrior: IWarrior; // Instantiated by the inversify

    public handle(value: Request): Promise<string> {
        return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
    }
}

const mediator = new Mediator({
    resolver: new InversifyResolver()
});

const result = await mediator.send(new Request(99));

// result => "We has 99 ninja fight"
```

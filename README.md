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
class Request implements IRequest<string> {
    name: string;
}

// handlertest.ts -> Add the attribute to the request handler
@requestHandler(Request)
class HandlerTest implements IRequestHandler<Request, string> {
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
const result = await mediator.send<string>(r);

// result = "Value passed Foo"
```

### Notification handlers

```typescript
import { Mediator } from "mediatr-ts";

const result: string[] = [];

// The notification class
class Ping implements INotification {
    constructor(public value?: string){}
}

// The notification handler
@notificationHandler(Ping)
class Pong1 implements INotificationHandler<Ping> {
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
import { mediatorSettings, Mediator } from "mediatr-ts";

const result: string[] = [];

// The notification class
class Ping implements INotification {
    constructor(public value?: string){}
}

// The notification handler
@notificationHandler(Ping)
class Pong2 implements INotificationHandler<Ping> {
    async handle(notification: Ping): Promise<void> {
        result.push(notification.value);
    }
}

// The notification handler
@notificationHandler(Ping)
class Pong1 implements INotificationHandler<Ping> {
    async handle(notification: Ping): Promise<void> {
        result.push(notification.value);
    }
}

const mediator = new Mediator();
mediator.publish(new Ping(message));

// result: [ "Foo" ]

// Set the order of the pipeline behaviors. Pong2 will be executed first, and then Pong1.
mediatorSettings.dispatcher.notifications.setOrder(Ping, [
    Pong2, 
    Pong1
]);

const mediator = new Mediator();

//...
```

### Pipeline behaviors

```typescript
class Request {
    name?: string;
}

@requestHandler(Request)
class HandlerTest implements IRequestHandler<Request, string> {
    handle(value: Request): Promise<string> {
        return Promise.resolve(`Value passed ${value.name}`);
    }
}

@pipelineBehavior()
class PipelineBehaviorTest1 implements IPipelineBehavior {
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
class PipelineBehaviorTest2 implements IPipelineBehavior {
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
import { mediatorSettings, Mediator } from "mediatr-ts";

@pipelineBehavior()
class PipelineBehaviorTest1 implements IPipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        return result;
    }
}

@pipelineBehavior()
class PipelineBehaviorTest2 implements IPipelineBehavior {
    async handle(request: IRequest<unknown>, next: () => unknown): Promise<unknown> {
        return result;
    }
}

// Set the order of the pipeline behaviors. PipelineBehaviorTest2 will be executed first, and then PipelineBehaviorTest1.
mediatorSettings.dispatcher.behaviors.setOrder([
    PipelineBehaviorTest2, 
    PipelineBehaviorTest1
]);

const mediator = new Mediator();

//...
```

## Integrating with Dependency Injection containers

### Inversify

At the very beginning of your app you **MUST** setup the resolver with Inversify, or at least **BEFORE** using the `@requestHandler` attribute and/or the `Mediator` class.

```typescript
import { Container } from "inversify";
import { mediatorSettings, Mediator, IResolver } from "mediatr-ts";

const container = new Container();

// inversify.resolver.ts -> Implement the resolver
class InversifyResolver implements IResolver {
    resolve<T>(name: string): T {
        return container.get(name);
    }

    add(name: string, instance: Function): void {
        container.bind(name).to(instance as any);
    }

    remove(name: string): void {
        // not necessary- can be blank, never called by the lib, for debugging / testing only
        container.unbind(name);
    }

    clear(): void {
        // not necessary- can be blank, never called by the lib, for debugging / testing only
        container.unbindAll();
    }
}

// Set the resolver of MediatR-TS
mediatorSettings.resolver = new InversifyResolver();

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
class Request implements IRequest<number> {
    public thenumber: number;

    constructor(thenumber: number) {
        this.thenumber = thenumber;
    }
}

// Decorate the handler request with Handler and injectable attribute, notice the warrior property
@requestHandler(Request)
@injectable()
class HandlerRequest implements IRequestHandler<Request, string> {
    @inject(TYPES.IWarrior)
    public warrior: IWarrior; // Instantiated by the inversify

    public handle(value: Request): Promise<string> {
        return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
    }
}

const mediator = new Mediator();
const result = await mediator.send<string>(new Request(99));

// result => "We has 99 ninja fight"
```

## Edge cases

### Class with custom id

Sometimes when minifing source code can be classes with same name, for this issue you can specify a `customId` for the specified class

Below the `requestHandler` pattern with internal resolver, custom id `MyUniqueId` for class identifier and with the inversify library

```typescript
// request.ts -> Define the request
class Request implements IRequest<string> {
    name: string;
    uniqueId: "MyUniqueId"; // this must be equal to the value passed on the requestHandler
}

// handlertest.ts -> Add the attribute to the request handler
@requestHandler(Request, "MyUniqueId")
class HandlerTest implements IRequestHandler<Request, string> {
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
const result = await mediator.send<string>(r);

// result = "Value passed Foo"
```

### Notifications

The behaviour of the `uniqueId` on `requestHandler` exists on `notificationHandler`, below the code

``` typescript
    @notificationHandler(Ping, "MyPong1")
    class Pong1 implements INotificationHandler<Ping> {

        async handle(notification: Ping): Promise<void> {
            result.push(notification.value);
        }
    }
```

This code link the instance of `Pong1` with name `MyPong1`

## Examples

You can find some basic examples on the `src/examples` folder
Check also the `test` folder for more examples.

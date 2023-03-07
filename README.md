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
It work out-of-the-box with an internal resolver, however it can be 'plugged in' with [Inversify](https://inversify.io/).

See the [Wiki](https://github.com/m4ss1m0g/mediatr-ts/wiki) for more details

## Request Handler

Below the `requestHandler` pattern with internal resolver and with the inversify library

### Internal resolver

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

### Inversify resolver

At the very beginning of your app you **MUST** setup the resolver with inversify, or at least **BEFORE** using the `@requestHandler` attribute and/or the `Mediator` class.

```typescript
import container from "whatever";

// inversify.resolver.ts -> Implement the resolver
class InversifyResolver implements IResolver {
    resolve<T>(name: string): <T> {
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

// app.ts -> this can be defined at the beginning of the app
import settings from "@/models/settings";
import InversifyResolver from "whatever";

// Magic happens here
settings.resolver = new InversifyResolver();

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

// code

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

## Notification Handler

Below a simple example without Inversify. If you want Inversify to resolve the `NotificationHandler` you should configure the `resolver` property of `mediatorSettings` see the `requestHandler` example above.

```typescript
const result: string[] = [];

// The notification class
class Ping implements INotification {
    constructor(public value?: string){}
}

// The notification handler
@NotificationHandler(Ping, 1)
class Pong1 implements INotificationHandler<Ping> {

    async handle(notification: Ping): Promise<void> {
        result.push(notification.value);
    }
}

const mediator = new Mediator();
mediator.publish(new Ping(message));

// result: [ "Foo" ]
```

## Notes

The `resolver` can be plugged in with other DI containers, it's enought to implemente the `IResolver` interface and setup the `resolver` property of `mediatorSettings` (like the `Inversify` provider).

The `NotificationHandler` can be rewritten implementing the `IDispatcher` and setup the `dispatcher` property of `mediatorSettings`.

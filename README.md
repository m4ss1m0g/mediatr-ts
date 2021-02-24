# MediatR-TS

Porting to typescript of the famouse [MediatR](https://github.com/jbogard/MediatR) for C#.
It work out-of-the-box with an internal resolver, however it can be 'plugged in' with [Inversify](https://inversify.io/).

## Installation

| ToBe Defined

## Usage

Below usage with the internal provider and with the inversify library

### Internal resolver

``` typescript

// request.ts -> Define the request
class Request implements IRequest<string> {
    name: string;
}

// handlertest.ts -> Add the attribute to the request handler
@Handler(Request)
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
const result = await mediator.send<string, string>(r);

// result = "Value passed Foo"

```

### Inversify resolver

At the very beginning of your app you **MUST** setup the resolver with inversify, or at least **BEFORE** using the `@Handler` attribute and/or the `Mediator` class.

``` typescript

import container from "whatever";

// inversify.resolver.ts -> Implement the resolver
class InversifyResolver implements IResolver {
    resolve<Input, Output>(name: string): IRequestHandler<IRequest<Input>, Output> {
        const fx: IRequestHandler<IRequest<Input>, Output> = container.get(name);
        return fx;
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
import container from "whatever";

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

@Handler(Request)
@injectable()
class HandlerRequest implements IRequestHandler<Request, string> {
    @inject(TYPES.IWarrior)
    public warrior: IWarrior; // Instantiated by the inversify

    public handle(value: Request): Promise<string> {
        return Promise.resolve(`We has ${value.thenumber} ${this.warrior.fight()}`);
    }
}

const mediator = new Mediator();
const result = await mediator.send<number, string>(new Request(99));

// result => "We has 99 ninja fight"

```

/* eslint-disable @typescript-eslint/ban-types */
import IRequest from "@/interfaces/irequest";
import IRequestHandler from "@/interfaces/irequesthandler";
import IResolver from "@/interfaces/iresolver";

class Instance {
    private _name: string;
    private _value: Function;
    constructor(name: string, value: Function) {
        this._name = name;
        this._value = value;
    }

    public get name() {
        return this._name;
    }

    public get value() {
        return this._value;
    }
}

export default class Resolver implements IResolver {
    private _instances: Instance[] = [];

    public resolve<Input, Output>(name: string): IRequestHandler<IRequest<Input>, Output> {
        const e = this._instances.find((p) => p.name === name);
        if (!e) throw new Error(`Cannot find element with key: ${name}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handlerFx: any = e.value;
        return new handlerFx();
    }

    public add(name: string, fx: Function): void {
        const k = this._instances.find((p) => p.name === name);
        if (k === undefined) this._instances.push(new Instance(name, fx));
        else throw new Error(`The key ${name} is already been added`);
    }

    public remove(name: string): void {
        const i = this._instances.findIndex((p) => p.name === name);
        if (i >= 0) {
            this._instances.splice(i, 1);
        }
    }

    public clear(): void {
        this._instances = [];
    }
}

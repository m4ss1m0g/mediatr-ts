/* eslint-disable @typescript-eslint/ban-types */
let container: Instance[] = [];

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

class Container {
    
    public resolve(key: string): Function {
        const e = container.find((p) => p.name === key);
        if (e) return e.value;
        throw new Error(`Cannot find element with key: ${key}`);
    }

    public add(key: string, fx: Function): void {
        const k = container.find((p) => p.name === key);
        if (k === undefined) container.push(new Instance(key, fx));
        else throw new Error(`The key ${key} is already been added`);
    }

    public remove(key: string): void {
        const i = container.findIndex((p) => p.name === key);
        if (i >= 0) {
            container.splice(i, 1);
        }
    }

    public clear(): void {
        container = [];
    }
}

export default new Container();
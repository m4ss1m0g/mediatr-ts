/* eslint-disable @typescript-eslint/ban-types */
import IRequest from "@/interfaces/irequest";
import IRequestHandler from "@/interfaces/irequesthandler";
import IResolver from "@/interfaces/iresolver";

/**
 * The instance object to save the Handler functions and the relative key
 *
 * @class Instance
 */
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

/**
 * The internal resolver
 * Here handler functions and relative keys are stored and retrieved.
 */
export default class Resolver implements IResolver {
    // Contains the mapping of the functions
    private _instances: Instance[] = [];

    /**
     * Retrieve a func from the container
     * @param name The instance name to retrieve
     */
    public resolve<T>(name: string): IRequestHandler<IRequest<T>, T> {
        const e = this._instances.find((p) => p.name === name);
        if (!e) throw new Error(`Cannot find element with key: ${name}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handlerFx: any = e.value;
        return new handlerFx();
    }

    /**
     * Add a func and name to the container
     * @param name The instance name to add to the container
     * @param fx  The function to store with the instance name
     */
    public add(name: string, fx: Function): void {
        const k = this._instances.find((p) => p.name === name);
        if (k === undefined) this._instances.push(new Instance(name, fx));
        else throw new Error(`The key ${name} is already been added`);
    }

    /**
     * Remove an isntance from the container
     * @param name The instance name to remove from the container
     */
    public remove(name: string): void {
        const i = this._instances.findIndex((p) => p.name === name);
        if (i >= 0) {
            this._instances.splice(i, 1);
        }
    }

    /**
     *  Clear the container
     */
    public clear(): void {
        this._instances = [];
    }
}

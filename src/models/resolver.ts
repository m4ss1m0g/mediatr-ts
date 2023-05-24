/* eslint-disable @typescript-eslint/ban-types */
import type IResolver from "@/interfaces/iresolver.js";
import HandlerInstance from "@/models/handler.instance.js";


/**
 * The internal resolver
 * Here handler functions and relative keys are stored and retrieved.
 * 
 * @export
 * @class Resolver
 * @implements {IResolver}
 */
export default class Resolver implements IResolver {
    // Contains the mapping of the functions
    private _instances: HandlerInstance[] = [];

    /**
     * Retrieve a func from the container
     *
     * @template T
     * @param {string} name The instance name to retrieve
     * @returns {T}
     * @memberof Resolver
     */
    public resolve<T>(name: string): T {
        const e = this._instances.find((p) => p.name === name);
        if (!e) throw new Error(`Cannot find element with key: ${name}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handlerFx: any = e.value;
        return new handlerFx();
    }

    /**
     * Add a func and name to the container
     *
     * @param {string} name The instance name to add to the container
     * @param {Function} fx The function to store with the instance name
     * @memberof Resolver
     */
    public add(name: string, fx: Function): void {
        const k = this._instances.find((p) => p.name === name);
        if (k === undefined) this._instances.push(new HandlerInstance(name, fx));
        else throw new Error(`The key ${name} is already been added`);
    }

    /**
     * Remove an isntance from the container
     *
     * @param {string} name The instance name to remove from the container
     * @memberof Resolver
     */
    public remove(name: string): void {
        const i = this._instances.findIndex((p) => p.name === name);
        if (i >= 0) {
            this._instances.splice(i, 1);
        }
    }

    /**
     * Clear the container
     *
     * @memberof Resolver
     */
    public clear(): void {
        this._instances = [];
    }
}

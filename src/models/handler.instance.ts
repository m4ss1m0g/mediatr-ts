/* eslint-disable @typescript-eslint/ban-types */

/**
 * The instance object to save the Handler functions and the relative key
 *
 * @export
 * @class HandlerInstance
 */
export default class HandlerInstance {
    private _name: string;
    private _value: Function;

    /**
     * Creates an instance of HandlerInstance.
     * @param {string} name The name of the handler
     * @param {Function} value The fx handler
     * @memberof HandlerInstance
     */
    constructor(name: string, value: Function) {
        this._name = name;
        this._value = value;
    }

    /**
     * Get the name value
     *
     * @readonly
     * @type {string}
     * @memberof HandlerInstance
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Get the fx value
     *
     * @readonly
     * @type {Function}
     * @memberof HandlerInstance
     */
    public get value(): Function {
        return this._value;
    }
}

/**
 * A dispatch instance
 *
 * @export
 * @class DispatchInstance
 */
export default class DispatchInstance {
    private _eventName: string;
    private _order: number;
    private _handlerName: string;

    /**
     * Creates an instance of DispatchInstance.
     * @param {string} eventName The event name
     * @param {string} handlerName The handler name
     * @param {number} order The order of the event
     * @memberof DispatchInstance
     */
    constructor(eventName: string, handlerName: string, order: number) {
        this._eventName = eventName;
        this._handlerName = handlerName;
        this._order = order;
    }

    /**
     * Get the order of the instance
     *
     * @readonly
     * @type {number}
     * @memberof DispatchInstance
     */
    public get order(): number {
        return this._order;
    }

    /**
     * Get the event name
     *
     * @readonly
     * @type {string}
     * @memberof DispatchInstance
     */
    public get eventName(): string {
        return this._eventName;
    }

    /**
     * Get the handler name
     *
     * @readonly
     * @type {string}
     * @memberof DispatchInstance
     */
    public get handlerName(): string {
        return this._handlerName;
    }
}

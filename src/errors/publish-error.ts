export default class PublishError extends Error {
    public readonly results: PromiseSettledResult<unknown>[];

    constructor(message: string, results: PromiseSettledResult<unknown>[]) {
        super(message);

        this.name = "PublishError";

        // Fix for instanceOf 
        Object.setPrototypeOf(this, new.target.prototype);

        this.results = results;
    }
}

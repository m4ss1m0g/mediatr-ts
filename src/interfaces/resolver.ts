/**
 * The resolver interface.
 * 
 * @exports
 * @interface Resolver
 */
export default interface Resolver {
    /**
     * Retrieve an instance of a particular class. Used for instantiating things like request handlers, pipeline behaviors and notification handlers.
     * @param type The class to create an instance for.
     */
    resolve<T>(type: Class<T>): T;

    /**
     * Add a class to the resolver. Useful for registering things like request handlers, pipeline behaviors and notification handlers in dependency injection libraries.
     * @param type The class to create an instance for.
     */
    add<T>(type: Class<T>): void;
}

export type Class<T> = new (...args: unknown[]) => T;
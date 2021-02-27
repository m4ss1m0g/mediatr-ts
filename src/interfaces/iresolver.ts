import IRequest from "./irequest";
import IRequestHandler from "./irequesthandler";

/**
 * The resolver.
 * Implement this interface and call mediatrSettings.resolver at startup
 * for changing the container and resolution of instances
 *
 * @export
 * @interface IResolver
 */
export default interface IResolver {
    /**
     * Retrieve a func from the container
     * @param name The instance name to retrieve
     */
    resolve<T>(name: string): IRequestHandler<IRequest<T>, T>;

    /**
     * Add a func and name to the container
     * @param name The instance name to add to the container
     * @param fx  The function to store with the instance name
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    add(name: string, instance: Function): void;

    /**
     * Remove an isntance from the container
     * @param name The instance name to remove from the container
     */
    remove(name: string): void;
    
    /**
     *  Clear the container
     */
    clear(): void;
}

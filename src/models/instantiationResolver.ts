import Resolver, { Class } from "@/interfaces/resolver.js";

/**
 * The default resolver.
 */
export class InstantiationResolver implements Resolver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public add<T>(_type: Class<T>): void {
        // ignored - the instantiation resolver does not need to register anything.
    }

    public resolve<T>(type: Class<T>): T {
        return new type();
    }
}

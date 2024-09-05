import Resolver, { Class } from "@/interfaces/iresolver";

export class InstantiationResolver implements Resolver {
    public add<T>(_type: Class<T>): void {
        // ignored - the instantiation resolver does not need to register anything.
    }

    public resolve<T>(type: Class<T>): T {
        return new type();
    }
}
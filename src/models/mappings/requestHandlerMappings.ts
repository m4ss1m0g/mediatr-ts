import { RequestHandlerClass } from "@/interfaces/requestHandler.js";
import RequestData, { RequestDataClass } from "../requestData.js";
import { byOrder, OrderedMapping, OrderedMappings } from "./orderedMappings.js";

type RequestHandlerMappingData = {
    handlerClass: RequestHandlerClass<RequestData<unknown>, unknown>;
    requestClass: RequestDataClass<unknown>;
};

/**
 * Mapping for request handlers
 *
 * @exports
 */

export class RequestHandlerMappings extends OrderedMappings<RequestHandlerMappingData> {
    /**
     * Gets all mappings for a specific request if provided, otherwise returns all (sorted) mappings
     *
     * @throws Error if no mappings are found for specified argument
     * @param requestClass The request class to get mappings for
     * @returns The array of handler classes in the order in which they should be executed.
     */
    public getAll(
        requestClass?: RequestDataClass<unknown>
    ): OrderedMapping<RequestHandlerMappingData>[] {
        const items = this._mappings.filter(
            (p) => p.requestClass === requestClass || !requestClass
        );
        if (items.length === 0 && requestClass) {
            throw new Error(
                `No handler found for request ${requestClass.name}. Remember to decorate your handler with @requestHandler(${requestClass.name}).`
            );
        }

        return items.sort(byOrder);
    }

    /**
     * Throws an error if the request handler mapping already exists
     * @param requestClass The request class to check
     * @throws Error if the mapping already exists
     */
    public throwIfExistingTypeMappings(requestClass: RequestDataClass<unknown>): void {
        const existingTypeMappings = this.getAll().filter((x) => x.requestClass === requestClass);

        if (existingTypeMappings.length > 0) {
            throw new Error(
                `Request handler for ${requestClass.name} has been defined twice. Make sure you only have one @requestHandler decorator for each request type.`
            );
        }
    }
}

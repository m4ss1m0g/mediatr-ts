/* eslint-disable @typescript-eslint/ban-types */
import { RequestHandlerClass } from "@/interfaces/irequest.handler";
import { typeMappings } from "@/models/mappings.js";
import type { RequestClass } from "@/models/request.js";
import RequestBase from "@/models/request.js";

/**
 * Decorate the requestHandler with this attribute
 * 
 * @param value The request type
 */
const requestHandler = <T>(value: RequestClass<T>) => {
    return (target: Function): void => {
        const existingTypeMappings = typeMappings.requestHandlers.getAll().filter(x => x.requestClass === value);
        if(existingTypeMappings.length > 0) {
            throw new Error(`Request handler for ${value.name} has been defined twice. Make sure you only have one @requestHandler decorator for each request type.`);
        }

        typeMappings.requestHandlers.add({
            requestClass: value,
            handlerClass: target as RequestHandlerClass<RequestBase<unknown>, unknown>
        });
    };
};

export default requestHandler;

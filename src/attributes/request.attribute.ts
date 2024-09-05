/* eslint-disable @typescript-eslint/ban-types */
import { RequestHandlerClass } from "@/interfaces/irequest.handler";
import { typeMappings } from "@/models/mappings/index.js";
import type { RequestDataClass } from "@/models/request-data.js";
import RequestData from "@/models/request-data.js";

/**
 * Decorate the requestHandler with this attribute
 * 
 * @param value The request type
 */
const requestHandler = <T>(value: RequestDataClass<T>) => {
    return (target: Function): void => {
        const existingTypeMappings = typeMappings.requestHandlers.getAll().filter(x => x.requestClass === value);
        if(existingTypeMappings.length > 0) {
            throw new Error(`Request handler for ${value.name} has been defined twice. Make sure you only have one @requestHandler decorator for each request type.`);
        }

        typeMappings.requestHandlers.add({
            requestClass: value,
            handlerClass: target as RequestHandlerClass<RequestData<unknown>, unknown>
        });
    };
};

export default requestHandler;

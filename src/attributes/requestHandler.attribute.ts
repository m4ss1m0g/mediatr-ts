/* eslint-disable @typescript-eslint/ban-types */
import { RequestHandlerClass } from "@/interfaces/requestHandler.js";
import { typeMappings } from "@/models/mappings/index.js";
import type { RequestDataClass } from "@/models/requestData.js";
import RequestData from "@/models/requestData.js";

/**
 * Decorate the requestHandler with this attribute
 *
 * @param value The request type
 */
const requestHandler = <T>(value: RequestDataClass<T>) => {
    return (target: Function): void => {
        typeMappings.requestHandlers.throwIfExistingTypeMappings(value);

        typeMappings.requestHandlers.add({
            requestClass: value,
            handlerClass: target as RequestHandlerClass<RequestData<unknown>, unknown>
        });
    };
};

export default requestHandler;

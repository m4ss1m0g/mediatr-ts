import { RequestHandlerClass } from "@/interfaces/irequest.handler";
import RequestBase, { RequestClass } from "../request";
import { byOrder, OrderedMapping, OrderedMappings } from "./ordered.mappings";

type RequestHandlerMappingData = { 
    handlerClass: RequestHandlerClass<RequestBase<unknown>, unknown>,
    requestClass: RequestClass<unknown>
};

export class RequestHandlerMappings extends OrderedMappings<RequestHandlerMappingData> {
    public getAll(requestClass?: RequestClass<unknown>): OrderedMapping<RequestHandlerMappingData>[] {
        const items = this._mappings.filter((p) => p.requestClass === requestClass || !requestClass);
        if(items.length === 0 && requestClass) {
            throw new Error(`No handler found for request ${requestClass.name}. Remember to decorate your handler with @requestHandler(${requestClass.name}).`);
        }

        return items.sort(byOrder);
    }
}


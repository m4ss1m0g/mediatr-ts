import { RequestHandlerClass } from "@/interfaces/irequest.handler";
import RequestData, { RequestDataClass } from "../request-data";
import { byOrder, OrderedMapping, OrderedMappings } from "./ordered.mappings";

type RequestHandlerMappingData = { 
    handlerClass: RequestHandlerClass<RequestData<unknown>, unknown>,
    requestClass: RequestDataClass<unknown>
};

export class RequestHandlerMappings extends OrderedMappings<RequestHandlerMappingData> {
    public getAll(requestClass?: RequestDataClass<unknown>): OrderedMapping<RequestHandlerMappingData>[] {
        const items = this._mappings.filter((p) => p.requestClass === requestClass || !requestClass);
        if(items.length === 0 && requestClass) {
            throw new Error(`No handler found for request ${requestClass.name}. Remember to decorate your handler with @requestHandler(${requestClass.name}).`);
        }

        return items.sort(byOrder);
    }
}


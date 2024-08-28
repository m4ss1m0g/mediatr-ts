/* eslint-disable @typescript-eslint/ban-types */
import type { RequestClass } from "@/models/request.js";
import Resolver from "@/models/resolver.js";

/**
 * Decorate the requestHandler with this attribute
 * 
 * @param value The request type
 */
const requestHandler = <T>(value: RequestClass<T>) => {
    return (target: Function): void => {
        const name = (value as Function).prototype.constructor.name;
        Resolver.instance.add(name, target);
    };
};

export default requestHandler;

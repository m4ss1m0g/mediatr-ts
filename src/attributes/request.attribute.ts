/* eslint-disable @typescript-eslint/ban-types */
import type { IRequestClass } from "@/interfaces/irequest.js";
import { mediatorSettings } from "@/index.js";

/**
 * Decorate the requestHandler with this attribute
 *
 * @param value The request type
 */
const requestHandler = <T>(value: IRequestClass<T>, uniqueId?: string) => {
    return (target: Function): void => {
        const name = uniqueId ?? (value as Function).prototype.constructor.name;
        mediatorSettings.resolver.add(name, target);
    };
};

export default requestHandler;

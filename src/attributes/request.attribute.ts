/* eslint-disable @typescript-eslint/ban-types */
import IRequest from "@/interfaces/irequest";
import settings from "@/settings";

/**
 * Decorate the requestHandler with this attribute
 * 
 * @param value The request type
 */
const requestHandler = <T>(value: IRequest<T>) => {
    return (target: Function): void => {
        const name = (value as Function).prototype.constructor.name;
        settings.resolver.add(name, target);
    };
};

export default requestHandler;

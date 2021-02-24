/* eslint-disable @typescript-eslint/ban-types */
import IRequest from "@/interfaces/irequest";
import settings from "@/settings";

const Handler = <I>(value: IRequest<I>) => {
    return (target: Function): void => {
        const name = (value as Function).prototype.constructor.name;
        settings.resolver.add(name, target);
    };
};

export default Handler;

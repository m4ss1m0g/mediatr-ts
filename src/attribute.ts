/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "inversify";
import container from "./container";
import IRequest from "./irequest";

let _container: Container | undefined;

const Handler = <I>(value: IRequest<I>) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function): void => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const name = (value as Function).prototype.constructor.name;
        if (_container) _container.bind(name).to(target as any);
        else container.add(name, target);
    };
};

const HandlerSettings = {
    setContainer: (container: Container): void => {
        _container = container;
    }
}

export default Handler 
export { Handler, HandlerSettings };

import container from "./container";
import IRequest from "./irequest";

const Handler = <I>(value: IRequest<I>) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Function): void => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const name = (value as Function).prototype.constructor.name;
        container.add(name, target);
    };
};

export default Handler;
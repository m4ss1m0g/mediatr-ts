/* eslint-disable @typescript-eslint/ban-types */

import {mediatorSettings} from "@/index";
import type { IPipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";

/**
 * Decorate the pipelineBehavior with this attribute
 * 
 * @param value The request type
 */
const pipelineBehavior = () => {
    return (target: Function): void => {
        mediatorSettings.dispatcher.behaviors.add({
            behavior: target as IPipelineBehaviorClass
        });
    };
};

export default pipelineBehavior;

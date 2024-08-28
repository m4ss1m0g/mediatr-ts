/* eslint-disable @typescript-eslint/ban-types */

import type { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";
import Dispatcher from "@/models/dispatcher/index.js";

/**
 * Decorate the pipelineBehavior with this attribute
 * 
 * @param value The request type
 */
const pipelineBehavior = () => {
    return (target: Function): void => {
        Dispatcher.instance.behaviors.add({
            behavior: target as PipelineBehaviorClass
        });
    };
};

export default pipelineBehavior;

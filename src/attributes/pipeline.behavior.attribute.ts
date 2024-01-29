/* eslint-disable @typescript-eslint/ban-types */

import { mediatorSettings } from "@/index.js";
import type { IPipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";

/**
 * Decorate the pipelineBehavior with this attribute
 *
 * @param value The request type
 */
const pipelineBehavior = (uniqueId?: string) => {
    return (target: Function): void => {
        mediatorSettings.dispatcher.behaviors.add({
            behavior: target as IPipelineBehaviorClass,
            uniqueId,
        });
    };
};

export default pipelineBehavior;

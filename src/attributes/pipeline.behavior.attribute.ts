/* eslint-disable @typescript-eslint/ban-types */

import type { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior.js";
import { typeMappings } from "@/models/mappings.js";

/**
 * Decorate the pipelineBehavior with this attribute
 * 
 * @param value The request type
 */
const pipelineBehavior = () => {
    return (target: Function): void => {
        typeMappings.behaviors.add({
            behaviorClass: target as PipelineBehaviorClass
        });
    };
};

export default pipelineBehavior;

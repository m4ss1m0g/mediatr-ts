import { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";
import { OrderedMappings, OrderedMapping, byOrder } from "./ordered.mappings";

type PipelineBehaviorData = {
    behaviorClass: PipelineBehaviorClass
};

/**
 * The PipelineBehaviorMappings class is a subclass of OrderedMappings that is used to manage a collection of 
 * PipelineBehaviorData objects. 
 * 
 * @exports
 */
export class PipelineBehaviorMappings extends OrderedMappings<PipelineBehaviorData> {

    /**
     * This method takes an array of PipelineBehaviorClass objects and sets the order of each item in the _internal_ collection 
     * based on index in the array passed in.
     * 
     * @param behaviorClasses The ordered list of pipeline behavior classes
     */
    public setOrder(behaviorClasses: PipelineBehaviorClass[]) {
        const all = this.getAll();
        for(const handler of all) {
            handler.order = behaviorClasses.indexOf(handler.behaviorClass as PipelineBehaviorClass);
        }
    }

    /**
     * This method returns a sorted array of all the items in the collection. 
     * 
     * @returns The array of handler classes in the order in which they should be executed.
     */
    public getAll(): OrderedMapping<PipelineBehaviorData>[] {
        const items = [...this._mappings];
        return items.sort(byOrder);
    }
}
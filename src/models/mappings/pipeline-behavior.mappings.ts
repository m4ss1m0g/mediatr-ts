import { PipelineBehaviorClass } from "@/interfaces/ipipeline.behavior";
import { OrderedMappings, OrderedMapping, byOrder } from "./ordered.mappings";

type PipelineBehaviorData = {
    behaviorClass: PipelineBehaviorClass
};

export class PipelineBehaviorMappings extends OrderedMappings<PipelineBehaviorData> {
    public setOrder(behaviorClasses: PipelineBehaviorClass[]) {
        const all = this.getAll();
        for(const handler of all) {
            handler.order = behaviorClasses.indexOf(handler.behaviorClass as PipelineBehaviorClass);
        }
    }

    public getAll(): OrderedMapping<PipelineBehaviorData>[] {
        const items = [...this._mappings];
        return items.sort(byOrder);
    }
}
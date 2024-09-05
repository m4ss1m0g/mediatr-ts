export type OrderedMapping<TData = object> = TData & {
    order?: number;
}

export abstract class OrderedMappings<TData = object> {
    protected _mappings: OrderedMapping<TData>[];

    constructor() {
        this._mappings = [];
    }

    public add(mapping: OrderedMapping<TData>): void {
        if(mapping.order !== 0) {
            mapping.order = this._mappings.length;
        }
        this._mappings.push(mapping);
    }

    public clear(): void {
        this._mappings = [];
    }
}

export function byOrder<TIdentifier>(a: OrderedMapping<TIdentifier>, b: OrderedMapping<TIdentifier>): number {
    return (b.order || 0) - (a.order || 0);
}
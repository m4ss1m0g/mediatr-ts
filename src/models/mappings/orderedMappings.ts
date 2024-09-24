export type OrderedMapping<TData = object> = TData & {
    order?: number;
};

/**
 * OrderedMappings is an abstract class that manages a collection of ordered mappings,
 * where each mapping has a specific order and associated data.
 * 
 * @exports
 */
export abstract class OrderedMappings<TData = object> {
    protected _mappings: OrderedMapping<TData>[];

    constructor() {
        this._mappings = [];
    }

    /**
     * Adds a new mapping to the collection, automatically assigning an order if not provided ( defaults to the next available index).
     * @param mapping
     */
    public add(mapping: OrderedMapping<TData>): void {
        if (mapping.order !== 0) {
            mapping.order = this._mappings.length;
        }
        this._mappings.push(mapping);
    }

    /**
     * Resets the collection by removing all existing mappings.
     */
    public clear(): void {
        this._mappings = [];
    }

    /**
     * The mappings length
     * @returns The length
     */
    public get length(): number {
        return this._mappings.length;
    }
}

/**
 * Used to comapre elements in an ordered mapping
 * 
 * @exports
 * 
 * @param a The first element
 * @param b The second element
 * @returns The comparison result
 */
export function byOrder<TIdentifier>(
    a: OrderedMapping<TIdentifier>,
    b: OrderedMapping<TIdentifier>
): number {
    return (b.order || 0) - (a.order || 0);
}

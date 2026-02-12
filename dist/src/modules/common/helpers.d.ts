type SortableProperty = string;
type SortDirection = 'asc' | 'desc';
export declare function sortByProperty(arr: Record<string, any>[], property: SortableProperty, direction?: SortDirection): Record<string, any>[];
export {};

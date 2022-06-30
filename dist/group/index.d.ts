import { groupOptions } from "../typings/interface";
export declare class Group<K, V> extends Map<K, V> {
    #private;
    constructor(options: groupOptions, iterable?: Iterable<readonly [K, V]> | null | undefined);
    find(func: (value: V, key: K, map: this) => boolean): V | undefined;
    filter(func: (value: V, key: K, map: this) => boolean): Group<K, V>;
    top(number?: number): V | V[];
    topKey(number?: number): K | K[];
    bottom(number?: number): V | V[];
    map<U>(func: (value: V, key: K, map: this) => U): U[];
    mapAsync<U>(func: (value: V, key: K, map: this) => U): U[];
    get sweepType(): "timedSweep" | "noSweep" | "priority" | "auto";
    get limit(): number;
}
//# sourceMappingURL=index.d.ts.map
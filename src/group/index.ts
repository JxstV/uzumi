import { groupOptions } from "../typings/interface";
import { sizeOf } from "../utils/functions";

export class Group<K, V> extends Map<K, V> {
  #options: groupOptions;
  constructor(
    options: groupOptions,
    iterable?: Iterable<readonly [K, V]> | null | undefined,
  ) {
    super(iterable);
    options.limit = options.limit === null ? Infinity : options.limit;
    this.#options = options;
  }
  find(func: (value: V, key: K, map: this) => boolean) {
    const keys = [...this.keys()];
    let i = this.size;
    while (i-- > 0) {
      if (func(<V> this.get(keys[i]), keys[i],this)) return <V> this.get(keys[i]);
    }
    return;
  }
  filter(func: (value: V, key: K, map: this) => boolean) {
    const res = new Group<K,V>(this.#options);
    const keys = [...this.keys()];
    let i = this.size;
    while (i-- > 0) {
      if (func(<V> this.get(keys[i]), keys[i],this)) res.set(keys[i],<V> this.get(keys[i]));
    }
    return res;
  }
  top(number = 1) {
    const values = [...this.values()];
    return number === 1 ? values[0] : values.slice(0, number);
  }
  topKey(number = 1) {
    const values = [...this.keys()];
    return number === 1 ? values[0] : values.slice(0, number);
  }
  bottom(number = 1) {
    const values = [...this.values()];
    return number === 1 ? values[values.length - 1] : values.slice(-number);
  }
  map<U>(func: (value: V, key: K, map: this) => U) {
    const res: U[] = [];
    for (const [key, value] of this) {
      res.push(func(value, key,this));
    }
    return res;
  }
  mapAsync<U>(func: (value: V, key: K,map:this) => U) {
    const res: U[] = [];
    this.forEach(async (x, y) => {
      res.push(await func(x, y,this));
    });
    return res;
  }
  get sweepType() {
    return this.#options.sweepType;
  }
  get limit() {
    return this.#options.limit ?? Infinity;
  }
  get byteSize ()
  {
    return sizeOf( this );
  }
}

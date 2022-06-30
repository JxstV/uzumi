"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Group_options;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const functions_1 = require("../utils/functions");
class Group extends Map {
    constructor(options, iterable) {
        super(iterable);
        _Group_options.set(this, void 0);
        options.limit = options.limit === null ? Infinity : options.limit;
        __classPrivateFieldSet(this, _Group_options, options, "f");
    }
    find(func) {
        const keys = [...this.keys()];
        let i = this.size;
        while (i-- > 0) {
            if (func(this.get(keys[i]), keys[i], this))
                return this.get(keys[i]);
        }
        return;
    }
    filter(func) {
        const res = new Group(__classPrivateFieldGet(this, _Group_options, "f"));
        const keys = [...this.keys()];
        let i = this.size;
        while (i-- > 0) {
            if (func(this.get(keys[i]), keys[i], this))
                res.set(keys[i], this.get(keys[i]));
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
    map(func) {
        const res = [];
        for (const [key, value] of this) {
            res.push(func(value, key, this));
        }
        return res;
    }
    mapAsync(func) {
        const res = [];
        this.forEach(async (x, y) => {
            res.push(await func(x, y, this));
        });
        return res;
    }
    get sweepType() {
        return __classPrivateFieldGet(this, _Group_options, "f").sweepType;
    }
    get limit() {
        return __classPrivateFieldGet(this, _Group_options, "f").limit ?? Infinity;
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this);
    }
}
exports.Group = Group;
_Group_options = new WeakMap();
//# sourceMappingURL=index.js.map
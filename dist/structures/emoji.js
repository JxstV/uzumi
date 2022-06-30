"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Emoji_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emoji = void 0;
const functions_1 = require("../utils/functions");
const user_1 = require("./user");
class Emoji {
    constructor(data, guild, client) {
        _Emoji_client.set(this, void 0);
        __classPrivateFieldSet(this, _Emoji_client, client, "f");
        this.animated = data.animated ?? false;
        this.available = data.available ?? true;
        this.guildId = guild;
        this.id = data.id ? BigInt(data.id) : null;
        this.managed = data.managed ?? false;
        this.name = data.name;
        this.requireColons = data.require_colons;
        this.roles = data.roles ? data.roles.map(x => {
            return BigInt(x);
        }) : undefined;
        this.user = data.user ? new user_1.User(data.user, client) : data.user;
        this.rawData = data;
        this.clean();
    }
    clean() {
        const keys = Object.keys(this);
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined)
                //@ts-ignore:key is from this
                delete this[key];
        }
    }
    toString() {
        return this.id ? this.animated ? `<a:${this.name}:${this.id}>` : `<${this.name}:${this.id}>` : this.name;
    }
    get identifier() {
        return this.id ? `${this.name}:${this.id}` : null;
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this);
    }
}
exports.Emoji = Emoji;
_Emoji_client = new WeakMap();
//# sourceMappingURL=emoji.js.map
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Sticker_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sticker = void 0;
const functions_1 = require("../utils/functions");
const user_1 = require("./user");
class Sticker {
    constructor(data, guildId, client) {
        _Sticker_client.set(this, void 0);
        __classPrivateFieldSet(this, _Sticker_client, client, "f");
        this.asset = data.asset;
        this.available = data.available ?? false;
        this.description = data.description;
        this.formatType = data.format_type;
        this.guildId = BigInt(data.guild_id ?? guildId);
        this.id = BigInt(data.id);
        this.name = data.name;
        this.packId = data.pack_id ? BigInt(data.pack_id) : undefined;
        this.sortValue = data.sort_value;
        this.tags = data.tags;
        this.type = data.type;
        const user = data.user ? client.cache?.users?.get(BigInt(data.user.id)) ?? new user_1.User(data.user, client) : undefined;
        if (user instanceof user_1.User) {
            this.user = user;
        }
        else {
            this.user = user ? (0, functions_1.ConvertObjectToCamelCase)(user) : undefined;
        }
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
    get byteSize() {
        return (0, functions_1.sizeOf)(this.rawData);
    }
}
exports.Sticker = Sticker;
_Sticker_client = new WeakMap();
//# sourceMappingURL=sticker.js.map
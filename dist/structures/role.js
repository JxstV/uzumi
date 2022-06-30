"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Role_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const functions_1 = require("../utils/functions");
class Role {
    constructor(data, guild, client) {
        _Role_client.set(this, void 0);
        __classPrivateFieldSet(this, _Role_client, client, "f");
        this.color = data.color;
        this.guildId = BigInt(guild);
        this.hoist = data.hoist;
        this.icon = data.icon;
        this.id = BigInt(data.id);
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.name = data.name;
        this.permissions = {
            bits: typeof data.permissions === 'string' ? BigInt(data.permissions) : null,
            get array() {
                return (0, functions_1.parsePermissions)(this.bits);
            }
        };
        this.position = data.position;
        this.tags = data.tags ? {
            botId: data.tags.bot_id,
            integrationId: data.tags.integration_id,
            premiumSubscriber: data.tags.premium_subscriber,
        } : undefined;
        this.unicodeEmoji = data.unicode_emoji;
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
        return `<@&${this.id}>`;
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this.rawData);
    }
}
exports.Role = Role;
_Role_client = new WeakMap();
//# sourceMappingURL=role.js.map
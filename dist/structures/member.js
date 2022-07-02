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
var _Member_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const request_1 = require("../api/request");
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
const user_1 = require("./user");
class Member {
    constructor(data, guild, user, client) {
        _Member_client.set(this, void 0);
        __classPrivateFieldSet(this, _Member_client, client, "f");
        this.avatar = data.avatar;
        this.guildId = BigInt(guild);
        this.timeout = data.communication_disabled_until;
        this.deaf = data.deaf;
        this.joined = {
            at: data.joined_at ? new Date(data.joined_at) : null,
            timestamp: data.joined_at ? new Date(data.joined_at).getTime() : 0,
            toString() {
                return this.at ? this.at.toString() : "";
            }
        };
        this.mute = data.mute;
        this.nick = data.nick;
        this.pending = data.pending;
        this.permissions = {
            bits: typeof data.permissions === 'string' ? BigInt(data.permissions) : null,
            get array() {
                return (0, functions_1.parsePermissions)(this.bits);
            }
        };
        this.premium = {
            since: data.premium_since ?? null,
            timestamp: data.premium_since ? new Date(data.premium_since).getTime() : 0,
            toString() {
                return data.premium_since ? new Date(data.premium_since).toString() : "";
            }
        };
        this.roles = data.roles.map(x => BigInt(x));
        this.userId = BigInt(user);
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
        return `<@${this.userId}>`;
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this.rawData);
    }
    async getUser() {
        let res = __classPrivateFieldGet(this, _Member_client, "f").cache?.users?.get(this.userId);
        if (!this.rawData.user) {
            if (!res) {
                const data = {
                    url: (0, constants_1.api)(`users/${this.userId}`),
                    route: `users/${this.userId}`,
                    method: 'GET',
                };
                const reqData = await (0, request_1.requestApi)(data, __classPrivateFieldGet(this, _Member_client, "f"));
                res = new user_1.User(reqData, __classPrivateFieldGet(this, _Member_client, "f"));
                __classPrivateFieldGet(this, _Member_client, "f").cache?.users?.set(res.id, res);
            }
        }
        else {
            if (!res) {
                res = new user_1.User(this.rawData.user, __classPrivateFieldGet(this, _Member_client, "f"));
                __classPrivateFieldGet(this, _Member_client, "f").cache?.users?.set(res.id, res);
            }
        }
        return res;
    }
    avatarUrl({ size = 4096, animated = true, format = ".webp" } = {}) {
        if (!this.avatar)
            return null;
        else if (this.avatar.startsWith("a_")) {
            if (animated)
                return (0, constants_1.imageUrl)("guilds", this.guildId, "users", this.userId, "avatars", this.avatar, ".gif", "?size=", size);
        }
        else {
            return (0, constants_1.imageUrl)("guilds", this.guildId, "users", this.userId, "avatars", this.avatar, format, "?size=", size);
        }
    }
}
exports.Member = Member;
_Member_client = new WeakMap();
//# sourceMappingURL=member.js.map
"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _User_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const constants_1 = require("../utils/constants");
class User {
    constructor(data, client) {
        _User_client.set(this, void 0);
        __classPrivateFieldSet(this, _User_client, client, "f");
        this.accentColor = data.accent_color;
        this.avatar = data.avatar;
        this.banner = data.banner;
        this.bot = data.bot ?? false;
        this.discriminator = data.discriminator;
        this.email = data.email;
        this.flags = data.public_flags;
        this.id = BigInt(data.id);
        this.locale = data.locale;
        this.mfaEnabled = data.mfa_enabled ?? false;
        this.premiumType = data.premium_type;
        this.system = data.system ?? false;
        this.username = data.username;
        this.verified = data.verified;
        this.marked = false;
        this.guilds = [];
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
        return `<@${this.id}>`;
    }
    get tag() {
        return `${this.username}#${this.discriminator}`;
    }
    get hexAccentColor() {
        if (!this.accentColor)
            return `0`;
        else
            return this.accentColor.toString(16);
    }
    avatarUrl({ size = 4096, animated = true, format = ".webp" } = {}) {
        if (!this.avatar)
            return null;
        else if (this.avatar.startsWith("a_")) {
            if (animated)
                return (0, constants_1.imageUrl)("avatars", this.id, this.avatar, ".gif", "?size=", size);
        }
        else {
            return (0, constants_1.imageUrl)("avatars", this.id, this.avatar, format, "?size=", size);
        }
    }
    bannerUrl({ size = 4096, animated = true, format = ".webp" } = {}) {
        if (!this.banner)
            return null;
        else if (this.banner.startsWith("a_")) {
            if (animated)
                return (0, constants_1.imageUrl)("banners", this.id, this.banner, ".gif", "?size=", size);
        }
        else {
            return (0, constants_1.imageUrl)("banners", this.id, this.banner, format, "?size=", size);
        }
    }
}
exports.User = User;
_User_client = new WeakMap();
//# sourceMappingURL=user.js.map
import { Client } from "../client/client.ts";
import { ImageOptions, rawUserData } from "../typings/interface.ts";
import { Snowflake } from "../typings/types.ts";
import { imageUrl } from "../utils/constants.ts";
import { sizeOf } from "../utils/functions.ts";

export class User {
    #client: Client<boolean>;
    accentColor?: number | null | undefined;
    avatar?: string | null;
    banner?: string | null | undefined;
    bot: boolean;
    discriminator: string;
    email?: string | null | undefined;
    flags?: number | undefined;
    id: Snowflake;
    locale?: string | undefined;
    mfaEnabled: boolean;
    premiumType?: number | undefined;
    system: boolean;
    username: string;
    verified?: boolean | undefined;
    marked: boolean;
    rawData: rawUserData;
    guilds: Snowflake[];
    constructor(data: rawUserData, client: Client<boolean>) {
        this.#client = client
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
        const keys = Object.keys(this)
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined)
                //@ts-ignore:key is from this
                delete this[key];
        }
    }
    toString() {
        return `<@${this.id}>`
    }
    get tag() {
        return `${this.username}#${this.discriminator}`
    }
    get hexAccentColor() {
        if (!this.accentColor) return `0`;
        else return this.accentColor.toString(16);
    }
    avatarUrl({ size = 4096, animated = true, format = ".webp" }: ImageOptions = {}) {
        if (!this.avatar) return null;
        else if (this.avatar.startsWith("a_")) {
            if (animated) return imageUrl("avatars", this.id, this.avatar, ".gif", "?size=", size);
        } else {
            return imageUrl("avatars", this.id, this.avatar, format, "?size=", size)
        }
    }
    bannerUrl({ size = 4096, animated = true, format = ".webp" }: ImageOptions = {}) {
        if (!this.banner) return null;
        else if (this.banner.startsWith("a_")) {
            if (animated) return imageUrl("banners", this.id, this.banner, ".gif", "?size=", size);
        } else {
            return imageUrl("banners", this.id, this.banner, format, "?size=", size)
        }
    }
    get byteSize() {
        return sizeOf(this);
    }
}
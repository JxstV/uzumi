import { Client } from "../client/client.ts";
import { rawRoleData } from "../typings/interface.ts";
import { snowflake } from "../typings/types.ts";
import { parsePermissions, sizeOf } from "../utils/functions.ts";

export class Role {
    #client: Client<boolean>;
    color: number;
    guildId: bigint;
    hoist: boolean;
    icon?: string | null | undefined;
    id: bigint;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: { bits: bigint | null; readonly array: string[]; };
    position: number;
    tags: { botId: string; integrationId: string; premiumSubscriber?: boolean | null | undefined; } | undefined;
    unicodeEmoji?: string | null | undefined;
    rawData: rawRoleData
    constructor(data: rawRoleData, guild: snowflake, client: Client<boolean>) {
        this.#client = client;
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
                return parsePermissions(this.bits);
            }
        }
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
        const keys = Object.keys(this)
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined)
                //@ts-ignore:key is from this
                delete this[key];
        }
    }
    toString() {
        return `<@&${this.id}>`
    }
    get byteSize() {
        return sizeOf(this);
    }
}
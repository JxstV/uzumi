import { Client } from "../client/client.ts";
import { rawStickerData, rawUserData } from "../typings/interface.ts";
import { SnakeToCamelCaseNested, snowflake } from "../typings/types.ts";
import { ConvertObjectToCamelCase, sizeOf } from "../utils/functions.ts";
import { User } from "./user.ts";

export class Sticker {
    asset: string;
    available: boolean;
    description: string | null;
    formatType: number;
    guildId: bigint;
    id: bigint;
    name: string;
    packId?: bigint | undefined;
    sortValue?: number | undefined;
    tags: string;
    type: number;
    user?: User | SnakeToCamelCaseNested<rawUserData>
    rawData: rawStickerData;
#client: Client<boolean>;
    constructor(data: rawStickerData, guildId: snowflake, client: Client<boolean>) {
        this.#client = client;
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
        const user = data.user ? client.cache?.users?.get(BigInt(data.user.id)) ?? new User(data.user, client) : undefined;
        if (user instanceof User) {
            this.user = user;
        } else {
            this.user = user ? <SnakeToCamelCaseNested<rawUserData>>ConvertObjectToCamelCase(user) : undefined;
        }
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
    get byteSize() {
        return sizeOf(this.rawData);
    }
}
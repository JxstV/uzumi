import { Client } from "../client/client";
import { rawEmojiData } from "../typings/interface";
import { Snowflake, snowflake } from "../typings/types";
import { sizeOf } from "../utils/functions";
import { User } from "./user";

export class Emoji {
    #client: Client<boolean>;
    animated: boolean;
    available: boolean;
    id: bigint | null;
    managed: boolean;
    name: string | null;
    requireColons?: boolean | undefined;
    roles?: Snowflake[];
    user?: User | undefined;
    rawData: rawEmojiData;
guildId: string;
    constructor(data: rawEmojiData, guild: snowflake, client: Client<boolean>) {
        this.#client = client;
        this.animated = data.animated ?? false;
        this.available = data.available ?? true;
        this.guildId = guild;
        this.id = data.id ? BigInt(data.id) : null;
        this.managed = data.managed ?? false;
        this.name = data.name;
        this.requireColons = data.require_colons
        this.roles = data.roles ? data.roles.map(x => {
            return BigInt(x);
        }) : undefined;
        this.user = data.user ? new User(data.user, client) : data.user;
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
        return this.id ? this.animated ? `<a:${this.name}:${this.id}>` : `<${this.name}:${this.id}>` : this.name;
    }
    get identifier() {
        return this.id ? `${this.name}:${this.id}` : null;
    }
    get byteSize ()
    {
        return sizeOf( this.rawData );
    }
}
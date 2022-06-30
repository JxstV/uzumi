import { Client } from "../client/client";
import { rawEmojiData } from "../typings/interface";
import { Snowflake, snowflake } from "../typings/types";
import { User } from "./user";
export declare class Emoji {
    #private;
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
    constructor(data: rawEmojiData, guild: snowflake, client: Client<boolean>);
    clean(): void;
    toString(): string | null;
    get identifier(): string | null;
}
//# sourceMappingURL=emoji.d.ts.map
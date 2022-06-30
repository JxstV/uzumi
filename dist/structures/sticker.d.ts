import { Client } from "../client/client";
import { rawStickerData, rawUserData } from "../typings/interface";
import { SnakeToCamelCaseNested, snowflake } from "../typings/types";
import { User } from "./user";
export declare class Sticker {
    #private;
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
    user?: User | SnakeToCamelCaseNested<rawUserData>;
    rawData: rawStickerData;
    constructor(data: rawStickerData, guildId: snowflake, client: Client<boolean>);
}
//# sourceMappingURL=sticker.d.ts.map
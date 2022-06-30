import { Client } from "../client/client";
import { rawRoleData } from "../typings/interface";
import { snowflake } from "../typings/types";
export declare class Role {
    #private;
    color: number;
    guildId: bigint;
    hoist: boolean;
    icon?: string | null | undefined;
    id: bigint;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: {
        bits: bigint | null;
        readonly array: string[];
    };
    position: number;
    tags: {
        botId: string;
        integrationId: string;
        premiumSubscriber?: boolean | null | undefined;
    } | undefined;
    unicodeEmoji?: string | null | undefined;
    rawData: rawRoleData;
    constructor(data: rawRoleData, guild: snowflake, client: Client<boolean>);
    clean(): void;
    toString(): string;
}
//# sourceMappingURL=role.d.ts.map
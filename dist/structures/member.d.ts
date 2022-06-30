import { Client } from "../client/client";
import { ImageOptions, rawMemberData } from "../typings/interface";
import { snowflake } from "../typings/types";
export declare class Member {
    #private;
    avatar?: string | null | undefined;
    timeout?: string | null | undefined;
    deaf: boolean;
    joined: {
        at: Date | null;
        timestamp: number;
        toString(): string;
    };
    mute: boolean;
    nick?: string | null | undefined;
    pending?: boolean | undefined;
    permissions: {
        bits: bigint | null;
        readonly array: string[];
    };
    premium: {
        since: string | null;
        timestamp: number;
        toString(): string;
    };
    roles: bigint[];
    rawData: rawMemberData;
    guildId: bigint;
    userId: bigint;
    constructor(data: rawMemberData, guild: snowflake, user: snowflake, client: Client<boolean>);
    clean(): void;
    toString(): string;
    get byteSize(): number;
    avatarUrl({ size, animated, format }?: ImageOptions): string | null | undefined;
}
//# sourceMappingURL=member.d.ts.map
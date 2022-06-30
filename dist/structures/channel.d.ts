import { Client } from "../client/client";
import { Group } from "../group/index";
import { rawChannelData } from "../typings/interface";
import { SnakeToCamelCaseNested, snowflake } from "../typings/types";
import { Message } from "./message";
import { User } from "./user";
export declare class Channel {
    #private;
    applicationId?: string | undefined;
    bitrate?: number | undefined;
    defaultAutoArchiveDuration?: number | undefined;
    flags?: number | undefined;
    guildId: bigint;
    icon?: string | null | undefined;
    id: bigint;
    lastMessageId?: bigint | undefined;
    lastPinTimestamp?: string | null | undefined;
    marked: boolean;
    member: SnakeToCamelCaseNested<rawChannelData['member']>;
    memberCount?: number | undefined;
    messages?: Group<bigint, Message>;
    name?: string | null | undefined;
    nsfw?: boolean | undefined;
    ownerId?: bigint;
    parentId?: string | bigint | null | undefined;
    permissionOverwrites?: Group<bigint, {
        id: bigint;
        type: "Role" | "Member";
        allow: {
            bits: bigint | null;
            readonly array: string[];
        };
        deny: {
            bits: bigint | null;
            readonly array: string[];
        };
    }> | undefined;
    permissions: {
        bits: bigint | null;
        readonly array: string[];
    };
    position?: number | undefined;
    slowMode?: number | undefined;
    recipients?: Group<bigint, User> | undefined;
    rtcRegion?: string | null | undefined;
    threadMetaData?: SnakeToCamelCaseNested<rawChannelData['thread_metadata']>;
    topic?: string | null | undefined;
    type: number;
    userLimit?: number | undefined;
    videoQualityMode?: number | undefined;
    rawData: rawChannelData;
    constructor(data: rawChannelData, guild: snowflake, client: Client<boolean>);
    clean(): void;
    toString(): string;
}
//# sourceMappingURL=channel.d.ts.map
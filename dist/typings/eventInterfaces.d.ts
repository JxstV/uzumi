import { Message } from "../structures/message";
import { Client } from "./../client/client";
import { rawApplicationData, rawChannelData, rawGuildData, rawMemberData, rawMessageData, rawPresenceUpdateData, rawScheduledEventsData, rawStageInstanceData, rawUserData, rawVoiceStateData } from "./interface";
import { integer, SnakeToCamelCaseNested, snowflake } from "./types";
export interface EventManager<T> {
    MessageCreate(data: T extends true ? MESSAGE_CREATE : Message, client: Client): void;
    Hello(client: Client): void;
    Ready(data: SnakeToCamelCaseNested<READY>, client: Client): void;
}
export interface MESSAGE_CREATE extends rawMessageData {
    marked: boolean;
    guild_id: snowflake;
    member: rawMemberData;
    mentions: Array<rawUserData>;
}
export interface READY {
    v: integer;
    user: rawUserData;
    guilds: {
        id: snowflake;
        unavailable: boolean;
    }[];
    session_id: string;
    shard: [shardId: integer, shardCount: integer];
    application: rawApplicationData;
}
export interface GUILD_CREATE extends rawGuildData {
    joined_at: string;
    large: boolean;
    unavailable: boolean;
    member_count: integer;
    voice_states: Array<rawVoiceStateData>;
    members: Array<rawMemberData>;
    channels: Array<rawChannelData>;
    threads: Array<rawChannelData>;
    presences: Array<rawPresenceUpdateData>;
    stage_instances: Array<rawStageInstanceData>;
    guild_scheduled_events: Array<rawScheduledEventsData>;
}
//# sourceMappingURL=eventInterfaces.d.ts.map
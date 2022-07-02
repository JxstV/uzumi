import { Message } from "../structures/message";
import { Client } from "./../client/client";
import
{
  rawApplicationData,
  rawChannelData,
  rawGuildData,
  rawMemberData,
  rawMessageData,
  rawPresenceUpdateData,
  rawScheduledEventsData,
  rawStageInstanceData,
  rawUserData,
  rawVoiceStateData,
} from "./interface";
import { integer, SnakeToCamelCaseNested, snowflake } from "./types";
export interface EventManager<T>
{
  MessageCreate (
    data: T extends true ? MESSAGE_CREATE : Message,
    client: Client,
  ): void;
  Hello ( client: Client ): void;
  Ready ( data: SnakeToCamelCaseNested<READY>, client: Client ): void;
}

export interface MESSAGE_CREATE extends rawMessageData
{
  marked: boolean;
  guild_id: snowflake;
  member: rawMemberData;
  mentions: Array<rawUserData>;
}

export interface READY
{
  v: integer;
  user: rawUserData;
  guilds: {
    id: snowflake;
    unavailable: boolean;
  }[];
  session_id: string;
  shard: [ shardId: integer, shardCount: integer ];
  application: rawApplicationData;
}

export interface GUILD_CREATE extends rawGuildData
{
  joined_at: string; //	when this guild was joined at
  large: boolean; //	true if this is considered a large guild
  lazy: boolean;
  application_command_counts: {
    '1': number;
    '2': number;
    '3': number;
  };
  unavailable: boolean; //	true if this guild is unavailable due to an outage
  member_count: integer; //	total number of members in this guild
  voice_states: Array<rawVoiceStateData>; //	states of members currently in voice channels; lacks the guild_id key
  members: Array<rawMemberData>; //	users in the guild
  channels: Array<rawChannelData>; //	channels in the guild
  threads: Array<rawChannelData>; //	all active threads in the guild that current user has permission to view
  presences: Array<rawPresenceUpdateData>; //	presences of the members in the guild, will only include non-offline members if the size is greater than large threshold
  stage_instances: Array<rawStageInstanceData>; //	Stage instances in the guild
  guild_scheduled_events: Array<rawScheduledEventsData>; //	the scheduled events in the guild
}

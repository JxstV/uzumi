import { Client } from "./../client/client.ts";
import {
  rawApplicationData,
  rawMemberData,
  rawMessageData,
  rawUserData,
} from "./interface.ts";
import { integer, SnakeToCamelCaseNested, snowflake } from "./types.ts";
export interface EventManager {
  MessageCreate(
    data: SnakeToCamelCaseNested<MESSAGE_CREATE>,
    client: Client,
  ): void;
  Hello(client: Client): void;
  Ready(data: SnakeToCamelCaseNested<READY>, client: Client): void;
}

export interface MESSAGE_CREATE extends rawMessageData {
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

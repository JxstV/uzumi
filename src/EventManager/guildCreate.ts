import { Client } from "../client/client.ts";
import { Group } from "../group/index.ts";
import { Events } from "../typings/enums.ts";
import { GUILD_CREATE } from "../typings/eventInterfaces.ts";
import {
  rawCacheChannelData,
  rawCacheGuildData,
  rawCacheMessageData,
  rawCacheUserData,
  rawMemberData,
  rawUserData,
} from "../typings/interface.ts";
import { SnakeToCamelCaseNested, Snowflake } from "../typings/types.ts";
import { ConvertObjectToCamelCase } from "../utils/functions.ts";
export default async function handle(data: GUILD_CREATE, client: Client) {
  const msg = <SnakeToCamelCaseNested<rawCacheGuildData>>ConvertObjectToCamelCase(data);
  const channelArray: [Snowflake, SnakeToCamelCaseNested<rawCacheChannelData>][] =
    (msg).channels.map(
      (x: SnakeToCamelCaseNested<rawCacheChannelData>) => {
        if (x.type !== 13) {
          (x).messages = new Group<
            Snowflake,
            SnakeToCamelCaseNested<rawCacheMessageData>
          >(client.cacheOptions.messages);
        }
        return [BigInt(x.id), <SnakeToCamelCaseNested<rawCacheChannelData>>x];
      },
    );

  const threadArray: [Snowflake, SnakeToCamelCaseNested<rawCacheChannelData>][] = (msg)
    .threads.map((x: SnakeToCamelCaseNested<rawCacheChannelData>) => {
      (x).messages = new Group<
        Snowflake,
        SnakeToCamelCaseNested<rawCacheMessageData>
      >(client.cacheOptions.threads);
      return [BigInt(x.id), x];
    });

  const MemberArray: [Snowflake, SnakeToCamelCaseNested<rawMemberData>][] = (msg)
    .members.map((x) => {
      return [BigInt((<rawUserData>x.user).id), x];
    });

  if (client.cacheOptions.guilds.limit !== 0) {

    msg.channels = new Group<Snowflake, SnakeToCamelCaseNested<rawCacheChannelData>>(
      client.cacheOptions.channels,
      channelArray,
    );

    msg.threads = new Group(
      client.cacheOptions.threads,
      threadArray,
    );

    msg.members = new Group(
      client.cacheOptions.users,
      MemberArray,
    );

    client.cache?.guilds?.set(BigInt(msg.id), <SnakeToCamelCaseNested<rawCacheGuildData>>msg);
  }
  if (client.cacheOptions.channels.limit !== 0) {
    let i = 0;
    while (i < channelArray.length) {
      client.cache?.channels?.set(channelArray[i][0], channelArray[i][1]);
      i++;
    }
  }
  if (client.cacheOptions.users.limit !== 0) {
    let i = 0;
    while (i < MemberArray.length) {
      if (client.cache?.users?.has(MemberArray[i][0])) {
        const u = <SnakeToCamelCaseNested<rawCacheUserData>>client.cache.users.get(
          MemberArray[i][0],
        );
        u?.guilds.push(BigInt(msg.id));
        client.cache.users.set(MemberArray[i][0], u);
      } else {
        const user = (<rawCacheUserData>(MemberArray[i][1].user));
        user.guilds = [BigInt(msg.id)];
        client.cache?.users?.set(MemberArray[i][0], user);
      }
      i++;
    }
  }
  const funcs = client.__on__[Events.GuildCreate];
  if (!funcs) return;
  if (Array.isArray(funcs)) {
    for (const f of funcs) {
      await f(msg, client);
    }
  } else {
    funcs(msg, client);
  }
}

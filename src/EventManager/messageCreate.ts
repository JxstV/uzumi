import { Client } from "../client/client.ts";
import { Events } from "../typings/enums.ts";
import { MESSAGE_CREATE } from "../typings/eventInterfaces.ts";
import {
  rawCacheChannelData,
  rawCacheGuildData,
  rawCacheMessageData,
} from "../typings/interface.ts";
import { SnakeToCamelCaseNested } from "../typings/types.ts";
import { ConvertObjectToCamelCase } from "../utils/functions.ts";
export default async function handle(data: MESSAGE_CREATE, client: Client) {
  const msg = <SnakeToCamelCaseNested<rawCacheMessageData>>ConvertObjectToCamelCase(data);
  msg.marked = false;
  if (client.options.cacheOption?.messages) {
    if (client.cacheOptions.messages.cacheFunc(<SnakeToCamelCaseNested<rawCacheMessageData>>msg, BigInt(msg.id))) {
      if (client.cache?.channels) {
        const channel = <SnakeToCamelCaseNested<rawCacheChannelData>>client.cache.channels.get(
          BigInt((<SnakeToCamelCaseNested<rawCacheMessageData>>msg).channelId),
        );
        channel.messages.set(BigInt(msg.id), msg);
      }
      if (client.cache?.guilds) {
        const guild = <SnakeToCamelCaseNested<rawCacheGuildData>>client.cache.guilds.get(
          BigInt(msg.guildId),
        );
        const channel = <SnakeToCamelCaseNested<rawCacheChannelData>>guild.channels.get(
          BigInt(msg.channelId),
        );
        channel.messages.set(BigInt(msg.id), msg);
        guild.channels.set(BigInt(channel.id), channel);
        client.cache.guilds.set(BigInt(guild.id), guild);
      }
    }
  }
  const funcs = client.__on__[Events.MessageCreate];
  if (!funcs) return;
  if (Array.isArray(funcs)) {
    for (const f of funcs) {
      await f(msg, client);
    }
  } else {
    funcs(msg, client);
  }
}

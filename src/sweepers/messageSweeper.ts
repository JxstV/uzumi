import { Client } from "../client/client.ts";
import { Snowflake, snowflake } from "../typings/types.ts";

export function sweepMessages(
	client: Client,
) {
	let { sweepType, sweepFunc } = client.cacheOptions.messages;
	if (!sweepFunc) {
		sweepFunc = (value, _key, _map) => {
			if (!value.author.bot && !value.author.system && value.marked && (Date.now() - new Date(value.timestamp).getTime()) < 3600000) return true;
			else return false;
		}
	}
	if (client.cache?.channels) {
		const globalChannelsMessageCaches = client.cache.channels.values();
		if (sweepType === "noSweep") return;
		for (const channel of globalChannelsMessageCaches) {
			if (sweepType === 'timedSweep') {
				const guildChannel = client.cache.guilds?.get(
					BigInt(<snowflake>channel.guildId),
				)?.channels.get(BigInt(channel.id));
				if (channel.messages && (channel.messages.size < channel.messages.limit)) continue;
				const msgs = <Snowflake[]>channel.messages.topKey(
					Math.floor(channel.messages.size / 2),
				);
				for (const msg of msgs) {
					guildChannel?.messages.delete(msg);
					channel.messages.delete(msg);
				}
			} else if (sweepType === 'priority') {
				const guildChannel = client.cache.guilds?.get(
					BigInt(<snowflake>channel.guildId),
				)?.channels.get(BigInt(channel.id));
				if (channel.messages && (channel.messages.size < channel.messages.limit)) continue;
				channel.messages = channel.messages.filter(sweepFunc);
				if (guildChannel) {
					guildChannel.messages = guildChannel.messages.filter(sweepFunc);
				}
			} else {
				return;
			}
		}
	}
}

import { Client } from "../client/client.ts";
import { Channel } from "../structures/channel.ts";
import { Guild } from "../structures/guild.ts";
import { Message } from "../structures/message.ts";
import { Snowflake } from "../typings/types.ts";

export function sweepMessages<T extends boolean>(
	client: Client<T>,
) {
	let { sweepType, sweepFunc } = client.cacheOptions.messages;
	if (!sweepFunc) {
		sweepFunc = (value, _key, _map) => {
			if (!value.author.bot && !value.author.system && (<Message>value).marked && (Date.now() - new Date(value.timestamp).getTime()) < 3600000) return true;
			else return false;
		}
	}
	if (client.cache?.channels) {
		const globalChannelsMessageCaches = client.cache.channels.values();
		if (sweepType === "noSweep") return;
		for (const channel of globalChannelsMessageCaches) {
			if (sweepType === 'timedSweep') {
				const guild = client.cache.guilds?.get(
					//@ts-ignore:type is correct here
					channel instanceof Channel ? channel.guildId : channel.guild_id ?? "",
				);
				let guildChannel;
				if (guild) {
					if (guild instanceof Guild) {
						guildChannel = guild.channels.get(BigInt(channel.id));
					} else {
						guildChannel = guild.channels.find(x => x.id === channel.id.toString())
					}
				}
				if (channel instanceof Channel && channel.messages && (channel.messages.size < channel.messages.limit)) continue;
				//@ts-ignore if messages doesnt exists it wont matter on interface
				if (!channel.messages) continue;
				const msgs = <Snowflake[]>(<Channel>channel).messages?.topKey(
					Math.floor(((<Channel>channel).messages?.size ?? 0) / 2),
				);
				for (const msg of msgs) {
					//@ts-ignore: no issue here
					guildChannel?.messages?.delete(msg);
					//@ts-ignore: no issue here
					channel.messages.delete(msg);
				}
			} else if (sweepType === 'priority') {
				const guild = client.cache.guilds?.get(
					//@ts-ignore:type is correct here
					channel instanceof Channel ? channel.guildId : channel.guild_id ?? "",
				);
				let guildChannel;
				if (guild) {
					if (guild instanceof Guild) {
						guildChannel = guild.channels.get(BigInt(channel.id));
					} else {
						guildChannel = guild.channels.find(x => x.id === channel.id.toString())
					}
				}
				if (channel instanceof Channel && channel.messages && (channel.messages.size < channel.messages.limit)) continue;
				//@ts-ignore if messages doesnt exists it wont matter on interface
				if (!channel.messages) continue;
				(<Channel>channel).messages = (<Channel>channel).messages?.filter(sweepFunc);
				//@ts-ignore if messages doesnt exists it wont matter on interface
				if (guildChannel && guildChannel.messages) {
					//@ts-ignore if messages doesnt exists it wont matter on interface
					guildChannel.messages = guildChannel.messages?.filter(sweepFunc);
				}
			} else {
				return;
			}
		}
	}
}

import { Client } from "../client/client.ts";
import { Guild } from "../structures/guild.ts";
import { User } from "../structures/user.ts";
import { Events } from "../typings/enums.ts";
import { GUILD_CREATE } from "../typings/eventInterfaces.ts";
import { rawUserData } from "../typings/interface.ts";
export default async function handle<T extends boolean>(data: GUILD_CREATE, client: Client<T>) {
	let ParsedData;
	if (!client.rawData) ParsedData = new Guild(data, client);
	else ParsedData = data;
	if (client.cacheOptions.channels.limit !== 0) {
		for (const channel of ParsedData.channels) {
			if (Array.isArray(channel) && !client.rawData) {
				//@ts-ignore: this is always true
				client.cache?.channels?.set(channel[0], channel[1]);
			} else {
				//@ts-ignore: this is always false
				client.cache?.channels?.set(channel.id, channel);
			}
		}
	}
	if (client.cacheOptions.users.limit !== 0) {
		for (const member of data.members) {
			if (client.rawData) {
				//@ts-ignore: data is always raw here
				client.cache?.users?.set((<rawUserData>member.user).id, <rawUserData>member.user);
			} else {
				//@ts-ignore: data is always parsed here
				client.cache?.users?.set(BigInt((<rawUserData>member.user).id), new User(<rawUserData>member.user, client));
			}
		}
	}
	if (client.cacheOptions.guilds.limit !== 0) {
		//@ts-ignore: data is parsed 
		client.cache?.guilds?.set(ParsedData.id, ParsedData)
	}
	const funcs = client.__on__[Events.GuildCreate];
	if (!funcs) return;
	if (Array.isArray(funcs)) {
		for (const f of funcs) {
			await f(ParsedData, client);
		}
	} else {
		funcs(ParsedData, client);
	}
}

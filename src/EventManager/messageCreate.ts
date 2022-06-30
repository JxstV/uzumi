import { Client } from "../client/client.ts";
import { Channel } from "../structures/channel.ts";
import { Message } from "../structures/message.ts";
import { Events } from "../typings/enums.ts";
import { MESSAGE_CREATE } from "../typings/eventInterfaces.ts";
export default async function handle<T extends boolean>(data: MESSAGE_CREATE, client: Client<T>) {
	let ParsedData;
	if (!client.rawData) ParsedData = new Message(data, client);
	else ParsedData = data;
	if (client.cache?.channels) {
		if (!client.rawData) {
			//@ts-ignore: channel is Channel class 
			const channel = client.cache.channels.get((<Message>ParsedData).channelId);
			if ((channel instanceof Channel)) {
				channel.messages?.set((<Message>ParsedData).id, <Message>ParsedData)
			}
		}
	}
	const funcs = client.__on__[Events.MessageCreate];
	if (!funcs) return;
	if (Array.isArray(funcs)) {
		for (const f of funcs) {
			await f(ParsedData, client);
		}
	} else {
		funcs(ParsedData, client);
	}
}

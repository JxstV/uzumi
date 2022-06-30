import { Client } from "../client/client.ts";
import { Message } from "../structures/message.ts";
import { Events } from "../typings/enums.ts";
import { MESSAGE_CREATE } from "../typings/eventInterfaces.ts";
export default async function handle<T extends boolean>(data: MESSAGE_CREATE, client: Client<T>) {
	let ParsedData;
	if(!client.rawData) ParsedData = new Message(data,client); 
	else ParsedData = data;
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

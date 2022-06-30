import { Client } from "../client/client.ts";
import { Events } from "../typings/enums.ts";
import { READY } from "../typings/eventInterfaces.ts";
import { SnakeToCamelCaseNested } from "../typings/types.ts";
import { cleanObject, ConvertObjectToCamelCase } from "../utils/functions.ts";
export default async function handle<T extends boolean>(data: READY, client: Client<T>) {
	const obj = <SnakeToCamelCaseNested<READY>>ConvertObjectToCamelCase(data);
	obj.user.system = false;
	client.readyData = <SnakeToCamelCaseNested<READY>>cleanObject(obj);

	const funcs = client.__on__[Events.Ready];
	if (!funcs) return;
	if (Array.isArray(funcs)) {
		for (const f of funcs) {
			await f(client.readyData, client);
		}
	} else {
		funcs(client.readyData, client);
	}
}

import { Client } from "../client/client";
import { Events } from "../typings/enums";
import { MESSAGE_CREATE, READY } from "../typings/eventInterfaces";
import { SnakeToCamelCaseNested } from "../typings/types";
import { cleanObject, ConvertObjectToCamelCase } from "../utils/functions";
export default async function handle(data: READY, client: Client) {
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

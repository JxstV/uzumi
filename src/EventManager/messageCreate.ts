import { Client } from "../client/client.ts";
import { Events } from "../typings/enums.ts";
import { MESSAGE_CREATE } from "../typings/eventInterfaces.ts";
import { cleanObject, ConvertObjectToCamelCase } from "../utils/functions.ts";
export default async function handle(data: MESSAGE_CREATE, client: Client) {
  const msg = ConvertObjectToCamelCase(cleanObject(data));
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

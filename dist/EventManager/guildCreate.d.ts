import { Client } from "../client/client";
import { GUILD_CREATE } from "../typings/eventInterfaces";
export default function handle<T extends boolean>(data: GUILD_CREATE, client: Client<T>): Promise<void>;
//# sourceMappingURL=guildCreate.d.ts.map
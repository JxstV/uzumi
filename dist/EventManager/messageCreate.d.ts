import { Client } from "../client/client";
import { MESSAGE_CREATE } from "../typings/eventInterfaces";
export default function handle<T extends boolean>(data: MESSAGE_CREATE, client: Client<T>): Promise<void>;
//# sourceMappingURL=messageCreate.d.ts.map
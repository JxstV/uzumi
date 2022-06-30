import { Client } from "../client/client";
import { READY } from "../typings/eventInterfaces";
export default function handle<T extends boolean>(data: READY, client: Client<T>): Promise<void>;
//# sourceMappingURL=ready.d.ts.map
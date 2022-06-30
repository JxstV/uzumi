import { Client } from "../client/client";
import { Events } from "../typings/enums";
import { WSData } from "../typings/interface";
export declare function handle<T extends boolean>(event: Events, WSData: WSData["d"], client: Client<T>): Promise<void>;
//# sourceMappingURL=index.d.ts.map
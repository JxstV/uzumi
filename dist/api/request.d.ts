import { Client } from "../client/client";
import { requestData, requestOption } from "../typings/interface";
export declare function nonRouteRequest<T extends boolean>(data: requestData, options: requestOption, client: Client<T>): Promise<import("undici/types/dispatcher").ResponseData>;
export declare function requestApi<T extends boolean>(data: requestData, client: Client<T>): Promise<any>;
//# sourceMappingURL=request.d.ts.map
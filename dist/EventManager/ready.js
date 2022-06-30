"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../typings/enums");
const functions_1 = require("../utils/functions");
async function handle(data, client) {
    const obj = (0, functions_1.ConvertObjectToCamelCase)(data);
    obj.user.system = false;
    client.readyData = (0, functions_1.cleanObject)(obj);
    const funcs = client.__on__[enums_1.Events.Ready];
    if (!funcs)
        return;
    if (Array.isArray(funcs)) {
        for (const f of funcs) {
            await f(client.readyData, client);
        }
    }
    else {
        funcs(client.readyData, client);
    }
}
exports.default = handle;
//# sourceMappingURL=ready.js.map
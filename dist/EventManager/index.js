"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const enums_1 = require("../typings/enums");
const messageCreate_1 = __importDefault(require("./messageCreate"));
const guildCreate_1 = __importDefault(require("./guildCreate"));
const ready_1 = __importDefault(require("./ready"));
async function handle(event, WSData, client) {
    switch (event) {
        case enums_1.Events.MessageCreate:
            await (0, messageCreate_1.default)(WSData, client);
            break;
        case enums_1.Events.Ready:
            await (0, ready_1.default)(WSData, client);
            break;
        case enums_1.Events.GuildCreate:
            await (0, guildCreate_1.default)(WSData, client);
    }
}
exports.handle = handle;
//# sourceMappingURL=index.js.map
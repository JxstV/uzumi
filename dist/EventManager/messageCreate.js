"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_1 = require("../structures/channel");
const message_1 = require("../structures/message");
const enums_1 = require("../typings/enums");
async function handle(data, client) {
    let ParsedData;
    if (!client.rawData)
        ParsedData = new message_1.Message(data, client);
    else
        ParsedData = data;
    if (client.cache?.channels) {
        if (!client.rawData) {
            //@ts-ignore: channel is Channel class 
            const channel = client.cache.channels.get(ParsedData.channelId);
            if ((channel instanceof channel_1.Channel)) {
                channel.messages?.set(ParsedData.id, ParsedData);
            }
        }
    }
    const funcs = client.__on__[enums_1.Events.MessageCreate];
    if (!funcs)
        return;
    if (Array.isArray(funcs)) {
        for (const f of funcs) {
            await f(ParsedData, client);
        }
    }
    else {
        funcs(ParsedData, client);
    }
}
exports.default = handle;
//# sourceMappingURL=messageCreate.js.map
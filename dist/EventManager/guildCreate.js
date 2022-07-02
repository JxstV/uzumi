"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = require("../structures/guild");
const user_1 = require("../structures/user");
const enums_1 = require("../typings/enums");
async function handle(data, client) {
    let ParsedData;
    if (!client.rawData)
        ParsedData = new guild_1.Guild(data, client);
    else
        ParsedData = data;
    if (client.cacheOptions.channels.limit !== 0) {
        for (const channel of ParsedData.channels) {
            if (Array.isArray(channel) && !client.rawData) {
                //@ts-ignore: this is always true
                client.cache?.channels?.set(channel[0], channel[1]);
            }
            else {
                //@ts-ignore: this is always false
                client.cache?.channels?.set(channel.id, channel);
            }
        }
    }
    if (client.cacheOptions.users.limit !== 0) {
        for (const member of data.members) {
            if (client.rawData) {
                //@ts-ignore: data is always raw here
                client.cache?.users?.set(member.user.id, member.user);
            }
            else {
                const user = new user_1.User(member.user, client);
                user.guilds.push(ParsedData.id);
                //@ts-ignore: data is always parsed here
                client.cache?.users?.set(BigInt(member.user.id), user);
            }
        }
    }
    if (client.cacheOptions.guilds.limit !== 0) {
        //@ts-ignore: data is parsed 
        client.cache?.guilds?.set(ParsedData.id, ParsedData);
    }
    const funcs = client.__on__[enums_1.Events.GuildCreate];
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
//# sourceMappingURL=guildCreate.js.map
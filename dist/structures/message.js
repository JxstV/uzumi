"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Message_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const index_1 = require("../group/index");
const functions_1 = require("../utils/functions");
const member_1 = require("./member");
const user_1 = require("./user");
class Message {
    constructor(data, client) {
        _Message_client.set(this, void 0);
        __classPrivateFieldSet(this, _Message_client, client, "f");
        this.attachments = data.attachments.length ? new index_1.Group({ limit: null, sweepType: "noSweep" }, data.attachments.map(x => {
            const a = (0, functions_1.ConvertObjectToCamelCase)(x);
            const updatedParts = {
                id: BigInt(a.id),
            };
            const d = { ...a, ...updatedParts };
            return [d.id, d];
        })) : undefined;
        data.author.guilds = [BigInt(data.guild_id)];
        this.author = client.cache?.users?.get(BigInt(data.author.id)) ?? new user_1.User(data.author, __classPrivateFieldGet(this, _Message_client, "f"));
        this.channelId = BigInt(data.channel_id);
        this.content = data.content;
        this.editTimstamp = data.edited_timestamp;
        this.embeds = data.embeds.map(x => (0, functions_1.ConvertObjectToCamelCase)(x));
        this.guildId = BigInt(data.guild_id);
        this.id = BigInt(data.id);
        this.member = data.member ? new member_1.Member(data.member, data.guild_id, data.author.id, __classPrivateFieldGet(this, _Message_client, "f")) : data.member;
        this.mentions = {
            everyone: data.mention_everyone,
            channels: data.mention_channels ? data.mention_channels.map(x => {
                return {
                    id: BigInt(x.id),
                    guildId: BigInt(x.guild_id),
                    name: x.name,
                    type: x.type,
                };
            }) : [],
            roles: data.mention_roles ? data.mention_roles.map(x => {
                return {
                    ...x,
                    ...{
                        id: BigInt(x.id),
                        unicodeEmoji: x.unicode_emoji,
                        tags: x.tags ? {
                            botId: x.tags.bot_id ? BigInt(x.tags.bot_id) : null,
                            integrationId: x.tags.integration_id ? BigInt(x.tags.integration_id) : null,
                            premiumSubscriber: x.tags.premium_subscriber ?? false,
                        } : undefined
                    }
                };
            }) : [],
            users: data.mentions.map(x => {
                return new user_1.User(x, client);
            }),
        };
        this.timestamp = data.timestamp;
        this.marked = false;
        this.tts = data.tts;
        this.rawData = data;
        this.clean();
    }
    clean() {
        const keys = Object.keys(this);
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined)
                //@ts-ignore:key is from this
                delete this[key];
        }
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this);
    }
}
exports.Message = Message;
_Message_client = new WeakMap();
//# sourceMappingURL=message.js.map
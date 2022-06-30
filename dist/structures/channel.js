"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Channel_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const index_1 = require("../group/index");
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
const user_1 = require("./user");
class Channel {
    constructor(data, guild, client) {
        _Channel_client.set(this, void 0);
        __classPrivateFieldSet(this, _Channel_client, client, "f");
        this.applicationId = data.application_id;
        this.bitrate = data.bitrate;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.flags = data.flags;
        this.guildId = BigInt(data.guild_id ?? guild);
        this.icon = data.icon;
        this.id = BigInt(data.id);
        this.lastMessageId = data.last_message_id ? BigInt(data.last_message_id) : undefined;
        this.lastPinTimestamp = data.last_pin_timestamp;
        this.marked = false;
        this.member = data.member ? (0, functions_1.ConvertObjectToCamelCase)(data.member) : undefined;
        this.memberCount = data.member_count;
        this.messages = data.type !== 13 ? new index_1.Group(client.cacheOptions.messages) : undefined;
        this.name = data.name;
        this.nsfw = data.nsfw;
        this.ownerId = data.owner_id ? BigInt(data.owner_id) : undefined;
        this.parentId = data.parent_id ? BigInt(data.parent_id) : data.parent_id;
        this.permissionOverwrites = data.permission_overwrites ? new index_1.Group({ limit: null, sweepType: 'noSweep' }, data.permission_overwrites.map(x => {
            const data = {
                id: BigInt(x.id),
                type: constants_1.PermOverWritesType[x.type],
                allow: {
                    bits: typeof x.allow === 'string' ? BigInt(x.allow) : null,
                    get array() {
                        return (0, functions_1.parsePermissions)(this.bits);
                    }
                },
                deny: {
                    bits: typeof x.deny === 'string' ? BigInt(x.deny) : null,
                    get array() {
                        return (0, functions_1.parsePermissions)(this.bits);
                    }
                }
            };
            return [data.id, data];
        })) : undefined;
        this.permissions = {
            bits: typeof data.permissions === 'string' ? BigInt(data.permissions) : null,
            get array() {
                return (0, functions_1.parsePermissions)(this.bits);
            }
        };
        this.position = data.position;
        this.slowMode = data.rate_limit_per_user;
        this.recipients = data.recipients ? new index_1.Group({ limit: null, sweepType: 'noSweep' }, data.recipients.map(x => {
            const user = new user_1.User(x, client);
            return [user.id, user];
        })) : undefined;
        this.rtcRegion = data.rtc_region;
        this.threadMetaData = data.thread_metadata ? (0, functions_1.ConvertObjectToCamelCase)(data.thread_metadata) : undefined;
        this.topic = data.topic;
        this.type = data.type;
        this.userLimit = data.user_limit;
        this.videoQualityMode = data.video_quality_mode;
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
    toString() {
        return `<#${this.id}>`;
    }
}
exports.Channel = Channel;
_Channel_client = new WeakMap();
//# sourceMappingURL=channel.js.map
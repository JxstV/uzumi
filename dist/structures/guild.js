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
var _Guild_client;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const index_1 = require("../group/index");
const functions_1 = require("../utils/functions");
const channel_1 = require("./channel");
const emoji_1 = require("./emoji");
const member_1 = require("./member");
const role_1 = require("./role");
const sticker_1 = require("./sticker");
const user_1 = require("./user");
class Guild {
    constructor(data, client) {
        _Guild_client.set(this, void 0);
        __classPrivateFieldSet(this, _Guild_client, client, "f");
        this.afkChannel = {
            id: data.afk_channel_id ? BigInt(data.afk_channel_id) : null,
            timeout: data.afk_timeout,
        };
        this.applicationId = data.application_id;
        this.approx = {
            members: data.approximate_member_count,
            presences: data.approximate_presence_count,
        };
        this.banner = data.banner;
        this.channels = new index_1.Group(client.cacheOptions.guildChannels, data.channels.map(x => {
            const c = new channel_1.Channel(x, data.id, client);
            return [c.id, c];
        }));
        this.defaultMessageNotifications = data.default_message_notifications;
        this.description = data.description;
        this.discoverySplash = data.discovery_splash;
        this.emojis = new index_1.Group(client.cacheOptions.guildEmojis, data.emojis.map(x => [x.id ? BigInt(x.id) : x.name, new emoji_1.Emoji(x, data.id, __classPrivateFieldGet(this, _Guild_client, "f"))]));
        this.explicitContentFilter = data.explicit_content_filter;
        this.features = data.features;
        this.guildScheduledEvents = new index_1.Group(client.cacheOptions.guildScheduledEvents, data.guild_scheduled_events.map((x) => {
            const updatedParts = {
                id: BigInt(x.id),
                channelId: x.channel_id ? BigInt(x.channel_id) : null,
                entityId: x.entity_id ? BigInt(x.entity_id) : null,
                creatorId: x.creator_id ? BigInt(x.creator_id) : null,
                creator: x.creator ? new user_1.User(x.creator, __classPrivateFieldGet(this, _Guild_client, "f")) : null,
                guildId: BigInt(x.guild_id),
            };
            const data = { ...(0, functions_1.ConvertObjectToCamelCase)(x), ...updatedParts };
            return [data.id, data];
        }));
        this.icon = data.icon;
        this.iconHash = data.icon_hash;
        this.id = BigInt(data.id);
        this.joined = {
            at: new Date(data.joined_at),
            timestamp: new Date(data.joined_at).getTime(),
            toString() {
                return new Date(this.at).toString();
            }
        };
        this.large = data.large;
        this.marked = false;
        this.max = {
            members: data.max_members ?? null,
            presences: data.max_presences ?? null,
            videoChannelUsers: data.max_video_channel_users ?? null,
        };
        this.memberCount = data.member_count;
        this.members = new index_1.Group(client.cacheOptions.members, data.members.map(x => {
            const m = new member_1.Member(x, data.id, x.user.id, client);
            return [m.userId, m];
        }));
        this.mfaLevel = data.mfa_level;
        this.name = data.name;
        this.nsfw = data.nsfw_level;
        this.owner = data.owner;
        this.ownerId = BigInt(data.owner_id);
        this.permissions = {
            bits: data.permissions ? BigInt(data.permissions) : null,
            get array() {
                return (0, functions_1.parsePermissions)(this.bits);
            }
        };
        this.preferredLocale = data.preferred_locale;
        this.premium = {
            progressBarEnabled: data.premium_progress_bar_enabled,
            subScriptionsCount: data.premium_subscription_count ?? 0,
            tier: data.premium_tier,
        };
        this.presences = new index_1.Group(client.cacheOptions.guildPresences, data.presences.map(x => {
            const p = (0, functions_1.ConvertObjectToCamelCase)(x);
            const updatedParts = {
                user: new user_1.User(p.user, client)
            };
            const d = { ...p, ...updatedParts };
            return [d.user.id, d];
        }));
        this.publicUpdatesChannelId = data.public_updates_channel_id ? BigInt(data.public_updates_channel_id) : undefined;
        this.roles = new index_1.Group(client.cacheOptions.roles, data.roles.map(x => {
            const r = new role_1.Role(x, data.id, client);
            return [r.id, r];
        }));
        this.rulesChannelId = data.rules_channel_id ? BigInt(data.rules_channel_id) : undefined;
        this.splash = data.splash;
        this.stageInstances = new index_1.Group(client.cacheOptions.guildStageInstances, data.stage_instances.map(x => {
            const si = (0, functions_1.ConvertObjectToCamelCase)(x);
            const updatedParts = {
                id: BigInt(si.id),
                channelId: BigInt(si.channelId),
                guildId: BigInt(si.guildId),
                guildScheduledEventId: si.guildScheduledEventId ? BigInt(si.guildScheduledEventId) : null,
            };
            const data = { ...si, ...updatedParts };
            return [data.id, data];
        }));
        this.stickers = data.stickers ? new index_1.Group(client.cacheOptions.guildStickers, data.stickers.map(x => {
            const s = new sticker_1.Sticker(x, data.id, client);
            return [s.id, s];
        })) : undefined;
        this.systemChannel = {
            id: data.system_channel_id ? BigInt(data.system_channel_id) : null,
            flags: data.system_channel_flags,
        };
        this.threads = new index_1.Group(client.cacheOptions.threads, data.threads.map(x => {
            const t = new channel_1.Channel(x, data.id, client);
            return [t.id, t];
        }));
        this.unavailable = data.unavailable;
        this.vanityUrlCode = data.vanity_url_code;
        this.verificationLevel = data.verification_level;
        this.voiceStates = new index_1.Group(client.cacheOptions.guildVoiceStates, data.voice_states.map(x => {
            const vs = (0, functions_1.ConvertObjectToCamelCase)(x);
            const updatedParts = {
                channelId: vs.channelId ? BigInt(vs.channelId) : null,
                guildId: BigInt(data.id),
                userId: BigInt(vs.userId),
                member: vs.member ? this.members.get(BigInt(vs.userId)) : undefined,
            };
            const d = { ...vs, ...updatedParts };
            return [d.userId, data];
        }));
        const welcome = data.welcome_screen ? (0, functions_1.ConvertObjectToCamelCase)(data.welcome_screen) : undefined;
        if (!welcome)
            this.welcomeScreen = undefined;
        else {
            this.welcomeScreen = {
                description: welcome.description,
                welcomeChannels: welcome.welcomeChannels.map(x => {
                    const updatedParts = {
                        channelId: BigInt(x.channelId),
                        emojiId: x.emojiId ? BigInt(x.emojiId) : null,
                    };
                    return { ...x, ...updatedParts };
                })
            };
        }
        this.widget = {
            channelId: data.widget_channel_id ? BigInt(data.widget_channel_id) : null,
            enabled: data.widget_enabled ?? false,
        };
        this.rawData = data;
        this.clean();
    }
    clean() {
        const keys = Object.keys(this);
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined) {
                //@ts-ignore:key is from this
                delete this[key];
            }
            //@ts-ignore:key is from this
            else if (this[key] instanceof index_1.Group && this[key].size === 0) {
                //@ts-ignore:key is from this
                delete this[key];
            }
        }
    }
    get byteSize() {
        return (0, functions_1.sizeOf)(this);
    }
}
exports.Guild = Guild;
_Guild_client = new WeakMap();
//# sourceMappingURL=guild.js.map
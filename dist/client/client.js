"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Client_instances, _Client_on, _Client_parseIntents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const enums_1 = require("../typings/enums");
const startUp_1 = require("../websocket/startUp");
const constants_1 = require("../utils/constants");
const request_1 = require("../api/request");
const functions_1 = require("../utils/functions");
const index_1 = require("../group/index");
const messageSweeper_1 = require("../sweepers/messageSweeper");
const channel_1 = require("../structures/channel");
const structures_1 = require("../structures");
class Client {
    constructor(clientOptions, rawData) {
        _Client_instances.add(this);
        // deno-lint-ignore ban-types
        _Client_on.set(this, {});
        this.apiQueue = new Map();
        this.sweepers = [];
        this.rawData = rawData;
        this.options = clientOptions;
        if (this.cacheOptions.guilds.limit !== 0) {
            if (!this.cache) {
                this.cache = {};
            }
            this.cache.guilds = new index_1.Group(this.cacheOptions.guilds);
        }
        if (this.cacheOptions.channels.limit !== 0) {
            if (!this.cache) {
                this.cache = {};
            }
            this.cache.channels = new index_1.Group(this.cacheOptions.channels);
        }
        if (this.cacheOptions.users.limit !== 0) {
            if (!this.cache) {
                this.cache = {};
            }
            this.cache.users = new index_1.Group(this.cacheOptions.users);
        }
        if (this.cacheOptions.messages.limit !== 0) {
            this.sweepers.push(setInterval(() => {
                return (0, messageSweeper_1.sweepMessages)(this);
            }, 3600000));
        }
    }
    get __on__() {
        return __classPrivateFieldGet(this, _Client_on, "f");
    }
    on(event, func) {
        const val = __classPrivateFieldGet(this, _Client_on, "f")[enums_1.Events[event]];
        if (val) {
            if (Array.isArray(val))
                __classPrivateFieldGet(this, _Client_on, "f")[enums_1.Events[event]].push(func);
            else
                __classPrivateFieldGet(this, _Client_on, "f")[enums_1.Events[event]] = [val, func];
        }
        else {
            __classPrivateFieldGet(this, _Client_on, "f")[enums_1.Events[event]] = func;
        }
    }
    get identifyData() {
        return {
            token: this.options.token,
            compress: false,
            intents: __classPrivateFieldGet(this, _Client_instances, "m", _Client_parseIntents).call(this),
            large_threshold: this.options.identifyOptions?.largeThreshold ?? 250,
            presence: this.options.identifyOptions?.presence ?? undefined,
            properties: {
                os: this.options.identifyOptions?.properties?.os ?? process.platform,
                browser: this.options.identifyOptions?.properties?.browser ?? "ayaya",
                device: this.options.identifyOptions?.properties?.device ?? "ayaya",
            },
            shard: [0, 1],
        };
    }
    start() {
        this.startUp = new startUp_1.StartUp(this);
    }
    get uptime() {
        return Date.now() - this.startUp.readyTimestamp;
    }
    get ping() {
        return this.startUp.ping;
    }
    get token() {
        return this.options.token;
    }
    get user() {
        return this.readyData.user;
    }
    get cacheOptions() {
        return {
            guilds: this.options.cacheOption?.guilds ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            channels: this.options.cacheOption?.channels ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            users: this.options.cacheOption?.users ?? {
                limit: null,
                sweepType: "priority",
                sweepFunc: (val, _key, _msgMap) => {
                    if ((!val.bot && !val.system) && val.marked)
                        return true;
                    else
                        return false;
                },
                cacheFunc: (_val) => true,
            },
            messages: this.options.cacheOption?.messages ?? {
                limit: 100,
                sweepType: "timedSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            threads: this.options.cacheOption?.threads ?? {
                limit: 100,
                sweepType: "priority",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            emojis: this.options.cacheOption?.emojis ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildChannels: this.options.cacheOption?.guildChannels ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            roles: this.options.cacheOption?.roles ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildPresences: this.options.cacheOption?.guildPresences ?? {
                limit: null,
                cacheFunc: (_val) => true,
                sweepType: 'noSweep',
                sweepFunc: undefined,
            },
            members: this.options.cacheOption?.members ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildEmojis: this.options.cacheOption?.guildEmojis ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildScheduledEvents: this.options.cacheOption?.guildScheduledEvents ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            emojiRoles: this.options.cacheOption?.emojiRoles ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildStageInstances: this.options.cacheOption?.guildStageInstances ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildStickers: this.options.cacheOption?.guildStickers ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
            guildVoiceStates: this.options.cacheOption?.guildVoiceStates ?? {
                limit: null,
                sweepType: "noSweep",
                cacheFunc: (_val) => true,
                sweepFunc: undefined
            },
        };
    }
    //Audit Logs
    //Channels
    async getChannel(channelId, fetch = false) {
        if (this.cache?.channels && !fetch) {
            return this.cache.channels.get(channelId);
        }
        else {
            const data = {
                method: "GET",
                url: (0, constants_1.api)(`channels/${channelId}`),
                route: `channels/${channelId}`
            };
            const res = await (0, request_1.requestApi)(data, this);
            //@ts-ignore:it's fine 🔥🔥
            return (this.rawData ? res : new channel_1.Channel(res, this.cache?.channels?.get(res.id)?.[this.rawData ? 'guild_id' : 'guildId'], this));
        }
    }
    async modifyChannel(channelId, data) {
        let reqData = {
            method: 'PATCH',
            route: `channels/${channelId}`,
            auditLogReason: data.reason,
            url: (0, constants_1.api)(`channels/${channelId}`),
        };
        delete data.reason;
        if (this.rawData) {
            reqData.params = data;
        }
        else {
            const parsedData = (0, functions_1.ConvertObjectToSnakeCase)(data);
            parsedData.rate_limit_per_user = parsedData.slowmode;
            delete parsedData.slowmode;
            reqData.params = parsedData;
        }
        const res = await (0, request_1.requestApi)(reqData, this);
        return this.rawData ? res : new channel_1.Channel(res, res.guild_id, this);
    }
    async sendMessage(channelId, msgData) {
        const route = `channels/${channelId}`;
        const url = (0, constants_1.api)(`${route}/messages`);
        const data = {
            url,
            route,
            method: "POST",
            params: (0, functions_1.ConvertObjectToSnakeCase)(msgData),
        };
        const res = await (0, request_1.requestApi)(data, this);
        return this.rawData ? res : new structures_1.Message(res, this);
    }
}
exports.Client = Client;
_Client_on = new WeakMap(), _Client_instances = new WeakSet(), _Client_parseIntents = function _Client_parseIntents() {
    let res = 0;
    if (Array.isArray(this.options.intents)) {
        let i = this.options.intents.length;
        const intents = this.options.intents;
        while (i-- > 0) {
            res += enums_1.Intents[intents[i]];
        }
    }
    else if (typeof this.options.intents === 'number')
        return this.options.intents;
    else {
        return 524287;
    }
    return res;
};
//# sourceMappingURL=client.js.map
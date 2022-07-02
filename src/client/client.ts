import {
  IdentifyData,
  modifyChannelData,
  modifyRawChannelData,
  rawCacheUserData,
  rawChannelData,
  rawGuildData,
  rawMessageData,
  rawUserData,
  requestData,
  RoutedData,
} from "./../typings/interface.ts";
import { SnakeToCamelCaseNested, snowflake, Snowflake } from "./../typings/types.ts";
import { Events, Intents } from "../typings/enums.ts";
import { ClientOptions } from "../typings/interface.ts";
import { StartUp } from "../websocket/StartUp.ts";
import { EventManager, GUILD_CREATE, READY } from "../typings/eventInterfaces.ts";
import { api } from "../utils/constants.ts";
import { requestApi } from "../api/request.ts";
import { ConvertObjectToSnakeCase } from "../utils/functions.ts";
import { Group } from "../group/index.ts";
import { sweepMessages } from "../sweepers/messageSweeper.ts";
import { User } from "../structures/user.ts";
import { Guild } from "../structures/guild.ts";
import { Channel } from "../structures/channel.ts";
import { Message } from "../structures/message.ts";
export class Client<rawData extends (boolean) = false> {
  options: ClientOptions;
  readyData!: SnakeToCamelCaseNested<READY>;
  // deno-lint-ignore ban-types
  #on: Record<string, Function | Function[]> = {};
  apiQueue: Map<string, RoutedData> = new Map<string, RoutedData>();
  startUp!: StartUp<rawData>;
  cache?: {
    guilds?: Group<rawData extends true ? snowflake : Snowflake, rawData extends true ? GUILD_CREATE : Guild>;
    channels?: Group<rawData extends true ? snowflake : Snowflake, rawData extends true ? rawChannelData : Channel>;
    users?: Group<rawData extends true ? snowflake : Snowflake, rawData extends true ? rawUserData : User>;
  };
  sweepers: number[] = [];
  rawData: boolean | void;

  constructor(clientOptions: ClientOptions, rawData?: rawData) {
    this.rawData = rawData;
    this.options = clientOptions;
    if (this.cacheOptions.guilds.limit !== 0) {
      if (!this.cache) {
        this.cache = {}
      }
      this.cache.guilds = new Group(this.cacheOptions.guilds);
    }
    if (this.cacheOptions.channels.limit !== 0) {
      if (!this.cache) {
        this.cache = {}
      }
      this.cache.channels = new Group(this.cacheOptions.channels);
    }
    if (this.cacheOptions.users.limit !== 0) {
      if (!this.cache) {
        this.cache = {}
      }
      this.cache.users = new Group(this.cacheOptions.users);
    }
    if (this.cacheOptions.messages.limit !== 0) {
      this.sweepers.push(setInterval(() => {
        return sweepMessages(this);
      }, 3600000)
      );
    }
  }
  get __on__() {
    return this.#on;
  }
  on<K extends keyof EventManager<rawData>>(event: K, func: EventManager<rawData>[K]) {
    const val = this.#on[Events[event]];
    if (val) {
      // deno-lint-ignore ban-types
      if (Array.isArray(val)) (<Function[]>this.#on[Events[event]]).push(func);
      else this.#on[Events[event]] = [val, func];
    } else {
      this.#on[Events[event]] = func;
    }
  }
  get identifyData(): IdentifyData {
    return {
      token: this.options.token,
      compress: false,
      intents: this.#parseIntents(),
      large_threshold: this.options.identifyOptions?.largeThreshold ?? 250,
      presence: this.options.identifyOptions?.presence ?? undefined,
      properties: {
        os: this.options.identifyOptions?.properties?.os ?? Deno.build.os,
        browser: this.options.identifyOptions?.properties?.browser ?? "ayaya",
        device: this.options.identifyOptions?.properties?.device ?? "ayaya",
      },
      shard: [0, 1],
    };
  }
  #parseIntents() {
    let res = 0;
    if (Array.isArray(this.options.intents)) {
      let i = this.options.intents.length;
      const intents = this.options.intents;
      while (i-- > 0) {
        res += Intents[intents[i]];
      }
    } else if (typeof this.options.intents === 'number') return this.options.intents;
    else {
      return 524287;
    }
    return res;
  }
  start() {
    this.startUp = new StartUp(this);
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
        sweepFunc: (
          val: rawCacheUserData,
          _key: Snowflake,
          _msgMap: Group<Snowflake, rawCacheUserData>,
        ) => {
          if ((!val.bot && !val.system) && val.marked) return true;
          else return false;
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
  async getChannel(channelId: rawData extends true ? snowflake : Snowflake, fetch = false): Promise<(rawData extends true ? rawChannelData : Channel) | undefined> {
    if (this.cache?.channels && !fetch) {
      return this.cache.channels.get(channelId);
    } else {
      const data: requestData = {
        method: "GET",
        url: api(`channels/${channelId}`),
        route: `channels/${channelId}`
      };
      const res = <rawChannelData>await requestApi(data, this);
      //@ts-ignore:it's fine 🔥🔥
      return <rawData extends true ? rawChannelData : Channel>(this.rawData ? res : new Channel(res, this.cache?.channels?.get(res.id)?.[this.rawData ? 'guild_id' : 'guildId'], this));
    }
  }
  async modifyChannel(channelId: rawData extends true ? snowflake : Snowflake, data: rawData extends true ? modifyRawChannelData : modifyChannelData): Promise<rawData extends true ? rawChannelData : Channel> {
    const reqData: requestData = {
      method: 'PATCH',
      route: `channels/${channelId}`,
      auditLogReason: data.reason,
      url: api(`channels/${channelId}`),
    };
    delete data.reason;
    if (this.rawData) {
      reqData.params = <Record<string, unknown>>data;
    } else {
      const parsedData = ConvertObjectToSnakeCase(<Record<string, unknown>>data);
      parsedData.rate_limit_per_user = parsedData.slowmode;
      delete parsedData.slowmode;
      reqData.params = parsedData;
    }
    const res = await requestApi(reqData, this);
    return this.rawData ? res : new Channel(res, res.guild_id, this);
  }
  async sendMessage(
    channelId: Snowflake,
    msgData: { content: string },
  ): Promise<rawMessageData> {
    const route = `channels/${channelId}`;
    const url = api(`${route}/messages`);
    const data: requestData = {
      url,
      route,
      method: "POST",
      params: ConvertObjectToSnakeCase(msgData),
    };
    const res = await requestApi(data, this);
    return this.rawData ? res : new Message(res,this)
  }

  // Guilds
  async getGuild(guildId:rawData extends true ? snowflake : Snowflake,fetch = false) {
    let res : rawData extends true ? rawGuildData : Guild;
    if(this.cache?.guilds && !fetch) {
      //@ts
      return this.cache.guilds.get(guildId);
    } else {
      const reqData:requestData = {
        method: 'GET',
        url: api(`guilds/${guildId}`),
        route: `guilds/${guildId}`,
      }
      const data = await requestApi(reqData,this);
      res = this.rawData ? data : new Guild(data,this);
      return res;
    }
  }
}

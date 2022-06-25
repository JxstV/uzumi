import { IdentifyData, rawMessageData, requestData, RoutedData } from "./../typings/interface.ts";
import {
  SnakeToCamelCaseNested,
  Snowflake,
} from "./../typings/types.ts";
import { Events, Intents } from "../typings/enums.ts";
import { ClientOptions } from "../typings/interface.ts";
import { StartUp } from "../websocket/StartUp.ts";
import { EventManager, READY } from "../typings/eventInterfaces.ts";
import { api } from "../utils/constants.ts";
import { requestApi } from "../api/request.ts";
import { ConvertObjectToSnakeCase } from "../utils/functions.ts";
export class Client {
  options: ClientOptions;
  readyData!: SnakeToCamelCaseNested<READY>;
  // deno-lint-ignore ban-types
  #on: Record<string, Function | Function[]> = {};
  apiQueue: Map<string, RoutedData> = new Map<string, RoutedData>();
  startUp!: StartUp;
  constructor(clientOptions: ClientOptions) {
    this.options = clientOptions;
  }
  get __on__() {
    return this.#on;
  }
  on<K extends keyof EventManager>(event: K, func:  EventManager[K]) {
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
    let i = this.options.intents.length;
    const intents = this.options.intents;
    let res = 0;
    while (i-- > 0) {
      res += Intents[intents[i]];
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
  //Audit Logs
  getAuditLogs() {}
  //Channels
  sendMessage(channelId: Snowflake, msgData: { content: string }): Promise<rawMessageData> {
    const route = `channels/${channelId}`;
    const url = api(`${route}/messages`);
    const data: requestData = {
      url,
      route,
      method: "POST",
      params: ConvertObjectToSnakeCase(msgData),
    };
    return requestApi(data, this);
  }
}

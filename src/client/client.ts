import { IdentifyData, rawMessageData, requestData, RoutedData } from "./../typings/interface";
import {
  AyayaEvents,
  SnakeToCamelCaseNested,
  Snowflake,
} from "./../typings/types";
import { Events, Intents } from "../typings/enums";
import { ClientOptions } from "../typings/interface";
import { StartUp } from "../websocket/startUp";
import { EventManager, READY } from "../typings/eventInterfaces";
import { api } from "../utils/constants";
import { requestApi } from "../api/request";
import { ConvertObjectToSnakeCase } from "../utils/functions";
export class Client {
  options: ClientOptions;
  readyData!: SnakeToCamelCaseNested<READY>;
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
        os: this.options.identifyOptions?.properties?.os ?? process.platform,
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

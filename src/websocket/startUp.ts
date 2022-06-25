import { Events } from "./../typings/enums";
import { integer } from "./../typings/types";
import { HelloOpData, IdentifyData, WSData } from "./../typings/interface";
import ws, { WebSocket } from "ws";
import { WsOpCode } from "../typings/enums";
import { toCamelCase } from "../utils/functions";
import { Client } from "../client/client";
import { handle } from "../EventManager";
export class StartUp {
  ws: WebSocket;
  __s__: null | integer = null;
  readyTimestamp: number = -1;
  heartbeatInterval!: number;
  __timeout__!: NodeJS.Timer;
  __client__: Client;
  lastAcktimestamp: number = -1;
  ping: number = -1;
  constructor(client: Client) {
    this.ws = new ws("wss://gateway.discord.gg/?v=10&encoding=json");
    this.__client__ = client;
    this.ws.on("open", () => {
      this.readyTimestamp = Date.now();
      console.log("hi");
    });

    this.ws.on("message", async (data: string) => {
      const JSONData: WSData = JSON.parse(data);
      if (JSONData.op === WsOpCode.Hello) {
        this.heartbeatInterval = (<HelloOpData>JSONData).d.heartbeat_interval;
        const t = setTimeout(() => {
          this.ackHeartbeat();
          this.identify(this.__client__.identifyData);
          this.createACKTimer();
          clearTimeout(t);
        }, 2000);
      } else if (JSONData.op === WsOpCode.AckHeartbeat) {
        this.ping = performance.now() - this.lastAcktimestamp;
      } else if (JSONData.op === WsOpCode.Dispatch) {
        this.__s__ = JSONData.s;
        await handle(<Events>JSONData.t, JSONData.d, this.__client__);
      }
    });
    this.ws.on("close", (code, reason) => {
      console.log({ code, reason });
    });
  }
  createACKTimer() {
    this.__timeout__ = setInterval(() => {
      this.ackHeartbeat();
    }, this.heartbeatInterval);
  }
  ackHeartbeat() {
    const data = {
      op: WsOpCode.Heartbeat,
      d: this.__s__,
    };
    this.ws.send(JSON.stringify(data));
    this.lastAcktimestamp = performance.now();
  }
  identify(data: IdentifyData) {
    const sendData = {
      op: WsOpCode.Identify,
      d: data,
    };
    console.log("identify data sent");
    this.ws.send(JSON.stringify(sendData));
  }
}

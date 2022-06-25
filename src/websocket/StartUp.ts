import { handle } from "../EventManager/index.ts";
import { Client } from "../client/client.ts";
import { Events, WsOpCode } from "../typings/enums.ts";
import { HelloOpData, IdentifyData, WSData } from "../typings/interface.ts";
export class StartUp {
  ws: WebSocket;
  readyTimestamp = -1;
  __client__: Client;
  __s__: number | null = -1;
  lastAckTimestamp = -1;
  heartbeatInterval!: number;
  __timeout__!: number;
  ping = -1;
  constructor(client: Client) {
    this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
    this.__client__ = client;
    this.ws.addEventListener("open", () => {
      this.readyTimestamp = Date.now();
      console.log("hi");
    });
    this.ws.addEventListener("close", (code) => {
      console.log({ code: code.code, reason: code.reason });
    });
    this.ws.addEventListener("message", async (ev) => {
      const msg = ev.data;
      const JSONData: WSData = JSON.parse(msg);
      if (JSONData.op === WsOpCode.Hello) {
        this.heartbeatInterval = (<HelloOpData> JSONData).d.heartbeat_interval;
        const t = setTimeout(() => {
          this.ackHeartbeat();
          this.identify(this.__client__.identifyData);
          this.createACKTimer();
          clearTimeout(t);
        }, 2000);
      } else if (JSONData.op === WsOpCode.AckHeartbeat) {
        this.ping = performance.now() - this.lastAckTimestamp;
      } else if (JSONData.op === WsOpCode.Dispatch) {
        this.__s__ = JSONData.s;
        await handle(<Events> JSONData.t, JSONData.d, this.__client__);
      }
    });
  }
  ackHeartbeat() {
    const data = {
      op: WsOpCode.Heartbeat,
      d: this.__s__,
    };
    this.ws.send(JSON.stringify(data));
    this.lastAckTimestamp = performance.now();
  }
  createACKTimer() {
    this.__timeout__ = setInterval(() => {
      this.ackHeartbeat();
    }, this.heartbeatInterval);
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

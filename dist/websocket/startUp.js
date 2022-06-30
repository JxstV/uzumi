"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartUp = void 0;
const ws_1 = __importDefault(require("ws"));
const enums_1 = require("../typings/enums");
const EventManager_1 = require("../EventManager");
class StartUp {
    constructor(client) {
        this.__s__ = null;
        this.readyTimestamp = -1;
        this.lastAcktimestamp = -1;
        this.ping = -1;
        this.ackCompleted = true;
        this.__client__ = client;
        this.createConnection();
    }
    createConnection(resumed = false) {
        this.ws = new ws_1.default("wss://gateway.discord.gg/?v=10&encoding=json");
        this.ws.on("open", () => {
            this.readyTimestamp = Date.now();
            console.log("hi");
        });
        this.ws.on("message", async (data) => {
            const JSONData = JSON.parse(data);
            if (JSONData.op === enums_1.WsOpCode.Hello) {
                this.heartbeatInterval = JSONData.d.heartbeat_interval;
                const t = setTimeout(() => {
                    if (resumed) {
                        this.resume();
                    }
                    else {
                        this.ackHeartbeat();
                        this.identify(this.__client__.identifyData);
                        this.createACKTimer();
                    }
                    clearTimeout(t);
                }, 2000);
            }
            else if (JSONData.op === enums_1.WsOpCode.AckHeartbeat) {
                this.ackCompleted = true;
                this.ping = performance.now() - this.lastAcktimestamp;
            }
            else if (JSONData.op === enums_1.WsOpCode.Dispatch) {
                this.__s__ = JSONData.s;
                await (0, EventManager_1.handle)(JSONData.t, JSONData.d, this.__client__);
            }
            else if (JSONData.op === enums_1.WsOpCode.Reconnect) {
                this.reconnect();
            }
            else if (JSONData.op === enums_1.WsOpCode.InvalidSession) {
                const t = setTimeout(() => {
                    this.identify(this.__client__.identifyData);
                    clearTimeout(t);
                }, 2000);
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
        if (!this.ackCompleted) {
            this.reconnect();
        }
        else {
            const data = {
                op: enums_1.WsOpCode.Heartbeat,
                d: this.__s__,
            };
            this.ws.send(JSON.stringify(data));
            this.ackCompleted = false;
            this.lastAcktimestamp = performance.now();
        }
    }
    identify(data) {
        const sendData = {
            op: enums_1.WsOpCode.Identify,
            d: data,
        };
        console.log("identify data sent");
        this.ws.send(JSON.stringify(sendData));
    }
    resume() {
        const data = {
            op: enums_1.WsOpCode.Resume,
            d: {
                token: this.__client__.token,
                session_id: this.__client__.readyData.sessionId,
                seq: this.__s__,
            }
        };
        this.ws.send(JSON.stringify(data));
        this.createACKTimer();
        console.log("resumed");
    }
    reconnect() {
        this.ws.close();
        clearInterval(this.__timeout__);
        this.createConnection(true);
    }
}
exports.StartUp = StartUp;
//# sourceMappingURL=startUp.js.map
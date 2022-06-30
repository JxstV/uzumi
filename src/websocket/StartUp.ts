import { handle } from "../EventManager/index.ts";
import { Client } from "../client/client.ts";
import { Events, WsOpCode } from "../typings/enums.ts";
import { HelloOpData, IdentifyData, WSData } from "../typings/interface.ts";
export class StartUp<T extends boolean> {
	ws !: WebSocket;
	readyTimestamp = -1;
	__client__: Client<T>;
	__s__: number | null = -1;
	lastAckTimestamp = -1;
	ackCompleted = true;
	heartbeatInterval!: number;
	__timeout__!: number;
	ping = -1;
	constructor(client: Client<T>) {
		this.__client__ = client;
		this.createConnection();
	}
	createConnection(resumed = false) {
		this.ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
		this.ws.addEventListener("open", () => {
			this.readyTimestamp = this.readyTimestamp == -1? Date.now() : this.readyTimestamp;
			console.log("hi");
		});
		this.ws.addEventListener("close", (code) => {
			console.log({ code: code.code, reason: code.reason });
		});
		this.ws.addEventListener("message", async (ev) => {
			const msg = ev.data;
			const JSONData: WSData = JSON.parse(msg);
			if (JSONData.op === WsOpCode.Hello) {
				this.heartbeatInterval = (<HelloOpData>JSONData).d.heartbeat_interval;
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
			} else if (JSONData.op === WsOpCode.AckHeartbeat) {
				this.ackCompleted = true;
				this.ping = performance.now() - this.lastAckTimestamp;
			} else if (JSONData.op === WsOpCode.Dispatch) {
				this.__s__ = JSONData.s;
				await handle(<Events>JSONData.t, JSONData.d, this.__client__);
			} else if (JSONData.op === WsOpCode.Reconnect) {
				this.reconnect();
			} else if (JSONData.op === WsOpCode.InvalidSession) {
				const t = setTimeout(() => {
					this.identify(this.__client__.identifyData);
					clearTimeout(t);
				}, 2000);
			}
		});
	}
	ackHeartbeat() {
		if (!this.ackCompleted) {
			this.reconnect();
		} else {
			const data = {
				op: WsOpCode.Heartbeat,
				d: this.__s__,
			};
			this.ws.send(JSON.stringify(data));
			this.ackCompleted = false;
			this.lastAckTimestamp = performance.now();
		}
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
	resume() {
		const data = {
			op: WsOpCode.Resume,
			d: {
				token: this.__client__.token,
				session_id: this.__client__.readyData.sessionId,
				seq: this.__s__,
			}
		}
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

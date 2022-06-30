/// <reference types="node" />
import { integer } from "./../typings/types";
import { IdentifyData } from "./../typings/interface";
import { WebSocket } from "ws";
import { Client } from "../client/client";
export declare class StartUp<T extends boolean> {
    ws: WebSocket;
    __s__: null | integer;
    readyTimestamp: number;
    heartbeatInterval: number;
    __timeout__: NodeJS.Timer;
    __client__: Client<T>;
    lastAcktimestamp: number;
    ping: number;
    ackCompleted: boolean;
    constructor(client: Client<T>);
    createConnection(resumed?: boolean): void;
    createACKTimer(): void;
    ackHeartbeat(): void;
    identify(data: IdentifyData): void;
    resume(): void;
    reconnect(): void;
}
//# sourceMappingURL=startUp.d.ts.map
import { Client } from "../client/client.ts";
import { Events } from "../typings/enums.ts";
import { MESSAGE_CREATE, READY } from "../typings/eventInterfaces.ts";
import { WSData } from "../typings/interface.ts";
import MessageCreate from './messageCreate.ts';
import Ready from "./ready.ts";
export async function handle(
  event: Events,
  WSData: WSData["d"],
  client: Client,
) {
  switch (event) {
    case Events.MessageCreate: 
      await MessageCreate(<MESSAGE_CREATE>WSData, client);
      break;
    
    case Events.Ready:
      await Ready(<READY>WSData, client);
  }
}

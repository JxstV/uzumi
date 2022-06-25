import { Client } from "../client/client";
import { Events } from "../typings/enums";
import { MESSAGE_CREATE, READY } from "../typings/eventInterfaces";
import { WSData } from "../typings/interface";
import MessageCreate from "./messageCreate";
import Ready from "./ready";
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

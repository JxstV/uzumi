import { Client } from "../client/client";
import { Events } from "../typings/enums";
import
  {
    GUILD_CREATE,
    MESSAGE_CREATE,
    READY,
  } from "../typings/eventInterfaces";
import { WSData } from "../typings/interface";
import MessageCreate from "./messageCreate";
import GuildCreate from "./guildCreate";
import Ready from "./ready";
export async function handle<T extends boolean> (
  event: Events,
  WSData: WSData[ "d" ],
  client: Client<T>,
)
{
  switch ( event )
  {
    case Events.MessageCreate:
      await MessageCreate( <MESSAGE_CREATE> WSData, client );
      break;

    case Events.Ready:
      await Ready( <READY> WSData, client );
      break;

    case Events.GuildCreate:
      await GuildCreate( <GUILD_CREATE> WSData, client );
  }
}

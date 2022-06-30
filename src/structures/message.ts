import { Client } from "../client/client.ts";
import { Group } from "../group/index.ts";
import { MESSAGE_CREATE } from "../typings/eventInterfaces.ts";
import { rawAttachmentData, rawCacheUserData, rawEmbedData } from "../typings/interface.ts";
import { SnakeToCamelCaseNested } from '../typings/types.ts'
import { ConvertObjectToCamelCase } from "../utils/functions.ts";
import { Member } from "./member.ts";
import { User } from "./user.ts";
export class Message {
    #client: Client<boolean>;
    author: User;
    channelId: bigint;
    content: string;
    editTimstamp: string | null;
    embeds: { title?: string | undefined; type?: "video" | "image" | "rich" | "gifv" | "article" | "link" | undefined; description?: string | undefined; url?: string | undefined; timestamp?: string | undefined; color?: number | undefined; footer?: { text: string; iconUrl?: string | undefined; proxyIconUrl?: string | undefined; } | undefined; image?: { url: string; height?: number | undefined; width?: number | undefined; proxyUrl?: string | undefined; } | undefined; thumbnail?: { url: string; height?: number | undefined; width?: number | undefined; proxyUrl?: string | undefined; } | undefined; video?: { url: string; height?: number | undefined; width?: number | undefined; proxyUrl?: string | undefined; } | undefined; provider?: { name?: string | undefined; url?: string | undefined; } | undefined; author?: { name: string; iconUrl?: string | undefined; proxyIconUrl?: string | undefined; url?: string | undefined; } | undefined; fields?: { name: string; value: string; inline?: boolean | undefined; }[] | undefined; }[];
    guildId: bigint;
    id: bigint;
    member: Member;
    timestamp: string;
    marked: boolean;
    tts: boolean;
    rawData: MESSAGE_CREATE
    attachments?: Group<bigint, { id: bigint; filename: string; description?: string | undefined; contentType?: string | undefined; size: number; url: string; proxyUrl: string; height?: number | null | undefined; width?: number | null | undefined; ephemeral?: boolean | undefined; }> | undefined;
mentions: { everyone: boolean; channels: { id: bigint; guildId: bigint; name: string; type: number; }[]; roles: { id: bigint; unicodeEmoji: string|null|undefined; tags: { botId: bigint|null; integrationId: bigint|null; premiumSubscriber: boolean; }|undefined; name: string; color: number; hoist: boolean; icon?: string|null|undefined; unicode_emoji?: string|null|undefined; position: number; permissions: string; managed: boolean; mentionable: boolean; }[]; users: User[]; };
    
    constructor(data: MESSAGE_CREATE, client: Client<boolean>) {
        this.#client = client;
        this.attachments = data.attachments.length ? new Group(
            { limit: null, sweepType: "noSweep" },
            data.attachments.map(x => {
                const a = <SnakeToCamelCaseNested<rawAttachmentData>>ConvertObjectToCamelCase(x);
                const updatedParts = {
                    id: BigInt(a.id),
                }
                const d = { ...a, ...updatedParts };
                return [d.id, d];
            })
        ) : undefined;
        (<SnakeToCamelCaseNested<rawCacheUserData>>data.author).guilds = [BigInt(data.guild_id)];
        this.author = <User>client.cache?.users?.get(BigInt(data.author.id)) ?? new User(<SnakeToCamelCaseNested<rawCacheUserData>>data.author, this.#client);
        this.channelId = BigInt(data.channel_id);
        this.content = data.content;
        this.editTimstamp = data.edited_timestamp;
        this.embeds = data.embeds.map(x => <SnakeToCamelCaseNested<rawEmbedData>>ConvertObjectToCamelCase(x));
        this.guildId = BigInt(data.guild_id);
        this.id = BigInt(data.id);
        this.member = new Member(data.member, data.guild_id, data.author.id, this.#client)
        this.mentions = {
            everyone: data.mention_everyone,
            channels: data.mention_channels ? data.mention_channels.map(x => {
                return {
                    id: BigInt(x.id),
                    guildId: BigInt(x.guild_id),
                    name: x.name,
                    type: x.type,
                }
            }) : [],
            roles: data.mention_roles ? data.mention_roles.map(x => {
                return {
                    ...x,
                    ...{
                        id: BigInt(x.id),
                        unicodeEmoji: x.unicode_emoji,
                        tags: x.tags ? {
                            botId: x.tags.bot_id ? BigInt(x.tags.bot_id) : null,
                            integrationId: x.tags.integration_id ? BigInt(x.tags.integration_id) : null,
                            premiumSubscriber: x.tags.premium_subscriber ?? false,
                        } : undefined
                    }
                }
            }) : [],
            users: data.mentions.map(x => {
                return new User(x, client);
            }),
        }
        this.timestamp = data.timestamp;
        this.marked = data.marked ?? false;
        this.tts = data.tts;
        this.rawData = data;
        this.clean();
    }
    clean() {
        const keys = Object.keys(this)
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined)
                //@ts-ignore:key is from this
                delete this[key];
        }
    }
}
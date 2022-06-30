import { Client } from "../client/client";
import { Group } from "../group/index";
import { MESSAGE_CREATE } from "../typings/eventInterfaces";
import { Member } from "./member";
import { User } from "./user";
export declare class Message {
    #private;
    author: User;
    channelId: bigint;
    content: string;
    editTimstamp: string | null;
    embeds: {
        title?: string | undefined;
        type?: "video" | "image" | "rich" | "gifv" | "article" | "link" | undefined;
        description?: string | undefined;
        url?: string | undefined;
        timestamp?: string | undefined;
        color?: number | undefined;
        footer?: {
            text: string;
            iconUrl?: string | undefined;
            proxyIconUrl?: string | undefined;
        } | undefined;
        image?: {
            url: string;
            height?: number | undefined;
            width?: number | undefined;
            proxyUrl?: string | undefined;
        } | undefined;
        thumbnail?: {
            url: string;
            height?: number | undefined;
            width?: number | undefined;
            proxyUrl?: string | undefined;
        } | undefined;
        video?: {
            url: string;
            height?: number | undefined;
            width?: number | undefined;
            proxyUrl?: string | undefined;
        } | undefined;
        provider?: {
            name?: string | undefined;
            url?: string | undefined;
        } | undefined;
        author?: {
            name: string;
            iconUrl?: string | undefined;
            proxyIconUrl?: string | undefined;
            url?: string | undefined;
        } | undefined;
        fields?: {
            name: string;
            value: string;
            inline?: boolean | undefined;
        }[] | undefined;
    }[];
    guildId: bigint;
    id: bigint;
    member: Member;
    timestamp: string;
    marked: boolean;
    tts: boolean;
    rawData: MESSAGE_CREATE;
    attachments?: Group<bigint, {
        id: bigint;
        filename: string;
        description?: string | undefined;
        contentType?: string | undefined;
        size: number;
        url: string;
        proxyUrl: string;
        height?: number | null | undefined;
        width?: number | null | undefined;
        ephemeral?: boolean | undefined;
    }> | undefined;
    mentions: {
        everyone: boolean;
        channels: {
            id: bigint;
            guildId: bigint;
            name: string;
            type: number;
        }[];
        roles: {
            id: bigint;
            unicodeEmoji: string | null | undefined;
            tags: {
                botId: bigint | null;
                integrationId: bigint | null;
                premiumSubscriber: boolean;
            } | undefined;
            name: string;
            color: number;
            hoist: boolean;
            icon?: string | null | undefined;
            unicode_emoji?: string | null | undefined;
            position: number;
            permissions: string;
            managed: boolean;
            mentionable: boolean;
        }[];
        users: User[];
    };
    constructor(data: MESSAGE_CREATE, client: Client<boolean>);
    clean(): void;
}
//# sourceMappingURL=message.d.ts.map
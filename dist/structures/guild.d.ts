import { Client } from "../client/client";
import { Group } from "../group/index";
import { GUILD_CREATE } from "../typings/eventInterfaces";
import { Channel } from "./channel";
import { Emoji } from "./emoji";
import { Member } from "./member";
import { Role } from "./role";
import { Sticker } from "./sticker";
import { User } from "./user";
export declare class Guild {
    #private;
    id: bigint;
    afkChannel: {
        id: bigint | null;
        timeout: number;
    };
    applicationId: string | null;
    approx: {
        members: number | undefined;
        presences: number | undefined;
    };
    banner: string | null;
    channels: Group<bigint, Channel>;
    defaultMessageNotifications: number;
    description: string | null;
    discoverySplash: string | null;
    emojis: Group<string | bigint | null, Emoji>;
    explicitContentFilter: number;
    features: string[];
    guildScheduledEvents: Group<bigint, {
        id: bigint;
        channelId: bigint | null;
        entityId: bigint | null;
        creatorId: bigint | null;
        creator: User | null;
        guildId: bigint;
        name: string;
        description: string | null;
        scheduledStartTime: string;
        scheduledEndTime: string;
        privacyLevel: number;
        status: number;
        entityType: number;
        entityMetadata: {
            location?: string | undefined;
        } | null;
        userCount?: number | undefined;
        image?: string | null | undefined;
    }>;
    icon: string | null;
    iconHash?: string | null | undefined;
    joined: {
        at: Date;
        timestamp: number;
        toString(): string;
    };
    members: Group<bigint, Member>;
    large: boolean;
    marked: boolean;
    max: {
        members: number | null;
        presences: number | null;
        videoChannelUsers: number | null;
    };
    memberCount: number;
    mfaLevel: number;
    name: string;
    nsfw: number;
    owner?: boolean | undefined;
    ownerId: bigint;
    permissions: {
        bits: bigint | null;
        readonly array: string[];
    };
    preferredLocale: string;
    premium: {
        progressBarEnabled: boolean;
        subScriptionsCount: number;
        tier: number;
    };
    publicUpdatesChannelId: bigint | undefined;
    roles: Group<bigint, Role>;
    rulesChannelId: bigint | undefined;
    splash: string | null;
    stageInstances: Group<bigint, {
        id: bigint;
        channelId: bigint;
        guildId: bigint;
        guildScheduledEventId: bigint | null;
        topic: string;
        privacyLevel: number;
        discoverableDisabled: boolean;
    }>;
    systemChannel: {
        id: bigint | null;
        flags: number;
    };
    threads: Group<bigint, Channel>;
    unavailable: boolean;
    vanityUrlCode: string | null;
    verificationLevel: number;
    voiceStates: Group<bigint, GUILD_CREATE>;
    welcomeScreen?: {
        description: string | null;
        welcomeChannels: {
            channelId: bigint;
            emojiId: bigint | null;
            description: string;
            emojiName: string | null;
        }[];
    };
    widget: {
        channelId: bigint | null;
        enabled: boolean;
    };
    rawData: GUILD_CREATE;
    stickers?: Group<bigint, Sticker> | undefined;
    presences: Group<bigint, {
        user: User;
        guildId: string;
        status: "online" | "offline" | "idle" | "dnd";
        activities: {
            name: string;
            type: number;
            url?: string | null | undefined;
            createdAt: number;
            timestamps?: {
                start?: number | undefined;
                end?: number | undefined;
            } | undefined;
            applicationId?: string | undefined;
            details?: string | null | undefined;
            state?: string | null | undefined;
            emoji?: {
                id: string | null;
                name: string | null;
                roles?: string[] | undefined;
                user?: {
                    id: string;
                    username: string;
                    discriminator: string;
                    avatar: string | null;
                    bot?: boolean | undefined;
                    system?: boolean | undefined;
                    mfaEnabled?: boolean | undefined;
                    banner?: string | null | undefined;
                    accentColor?: number | null | undefined;
                    locale?: string | undefined;
                    verified?: boolean | undefined;
                    email?: string | null | undefined;
                    flags?: number | undefined;
                    premiumType?: number | undefined;
                    publicFlags?: number | undefined;
                } | undefined;
                requireColons?: boolean | undefined;
                managed?: boolean | undefined;
                animated?: boolean | undefined;
                available?: boolean | undefined;
            } | undefined;
            party?: {
                id?: string | undefined;
                size?: [current_size: number, max_size: number] | undefined;
            } | undefined;
            assets?: {
                largeImage?: string | undefined;
                largeText?: string | undefined;
                smallImage?: string | undefined;
                smallText?: string | undefined;
            } | undefined;
            secrets?: {
                join?: string | undefined;
                spectate?: string | undefined;
                match?: string | undefined;
            } | undefined;
            instance?: boolean | undefined;
            flags?: number | undefined;
            buttons?: {
                label: string;
                url: string;
            }[] | undefined;
        }[];
        clientStatus: {
            desktop?: string | undefined;
            mobile?: string | undefined;
            web?: string | undefined;
        };
    }>;
    applicationCommandsCount: {
        chatInput: number;
        user: number;
        message: number;
        readonly total: any;
    };
    constructor(data: GUILD_CREATE, client: Client<boolean>);
    clean(): void;
    get byteSize(): number;
}
//# sourceMappingURL=guild.d.ts.map
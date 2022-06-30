import { Client } from "../client/client.ts";
import { Group } from "../group/index.ts";
import { GUILD_CREATE } from "../typings/eventInterfaces.ts";
import { rawPresenceUpdateData, rawUserData, rawVoiceStateData, rawWelcomeData } from "../typings/interface.ts";
import { SnakeToCamelCaseNested } from "../typings/types.ts";
import { ConvertObjectToCamelCase, parsePermissions, sizeOf } from "../utils/functions.ts";
import { Channel } from "./channel.ts";
import { Emoji } from "./emoji.ts";
import { Member } from "./member.ts";
import { Role } from "./role.ts";
import { Sticker } from "./sticker.ts";
import { User } from "./user.ts";

export class Guild {
    id: bigint;
    #client: Client<boolean>;
    afkChannel: { id: bigint | null; timeout: number; };
    applicationId: string | null;
    approx: { members: number | undefined; presences: number | undefined; };
    banner: string | null;
    channels: Group<bigint, Channel>;
    defaultMessageNotifications: number;
    description: string | null;
    discoverySplash: string | null;
    emojis: Group<string | bigint | null, Emoji>;
    explicitContentFilter: number;
    features: string[];
    guildScheduledEvents: Group<bigint, { id: bigint; channelId: bigint | null; entityId: bigint | null; creatorId: bigint | null; creator: User | null; guildId: bigint; name: string; description: string | null; scheduledStartTime: string; scheduledEndTime: string; privacyLevel: number; status: number; entityType: number; entityMetadata: { location?: string | undefined; } | null; userCount?: number | undefined; image?: string | null | undefined; }>;
    icon: string | null;
    iconHash?: string | null | undefined;
    joined: { at: Date; timestamp: number; toString(): string; };
    members: Group<bigint, Member>;
    large: boolean;
    marked: boolean;
    max: { members: number | null; presences: number | null; videoChannelUsers: number | null; };
    memberCount: number;
    mfaLevel: number;
    name: string;
    nsfw: number;
    owner?: boolean | undefined;
    ownerId: bigint;
    permissions: { bits: bigint | null; readonly array: string[]; };
    preferredLocale: string;
    premium: { progressBarEnabled: boolean; subScriptionsCount: number; tier: number; };

    publicUpdatesChannelId: bigint | undefined;
    roles: Group<bigint, Role>;
    rulesChannelId: bigint | undefined;
    splash: string | null;
    stageInstances: Group<bigint, { id: bigint; channelId: bigint; guildId: bigint; guildScheduledEventId: bigint | null; topic: string; privacyLevel: number; discoverableDisabled: boolean; }>;
    systemChannel: { id: bigint | null; flags: number; };
    threads: Group<bigint, Channel>;
    unavailable: boolean;
    vanityUrlCode: string | null;
    verificationLevel: number;
    voiceStates: Group<bigint, GUILD_CREATE>;
    welcomeScreen?: { description: string | null; welcomeChannels: { channelId: bigint; emojiId: bigint | null; description: string; emojiName: string | null; }[]; };
    widget: { channelId: bigint | null; enabled: boolean; };
    rawData: GUILD_CREATE;
    stickers?: Group<bigint, Sticker> | undefined;
presences: Group<bigint,{ user: User; guildId: string; status: "online"|"offline"|"idle"|"dnd"; activities: { name: string; type: number; url?: string|null|undefined; createdAt: number; timestamps?: { start?: number|undefined; end?: number|undefined; }|undefined; applicationId?: string|undefined; details?: string|null|undefined; state?: string|null|undefined; emoji?: { id: string|null; name: string|null; roles?: string[]|undefined; user?: { id: string; username: string; discriminator: string; avatar: string|null; bot?: boolean|undefined; system?: boolean|undefined; mfaEnabled?: boolean|undefined; banner?: string|null|undefined; accentColor?: number|null|undefined; locale?: string|undefined; verified?: boolean|undefined; email?: string|null|undefined; flags?: number|undefined; premiumType?: number|undefined; publicFlags?: number|undefined; }|undefined; requireColons?: boolean|undefined; managed?: boolean|undefined; animated?: boolean|undefined; available?: boolean|undefined; }|undefined; party?: { id?: string|undefined; size?: [current_size: number,max_size: number]|undefined; }|undefined; assets?: { largeImage?: string|undefined; largeText?: string|undefined; smallImage?: string|undefined; smallText?: string|undefined; }|undefined; secrets?: { join?: string|undefined; spectate?: string|undefined; match?: string|undefined; }|undefined; instance?: boolean|undefined; flags?: number|undefined; buttons?: { label: string; url: string; }[]|undefined; }[]; clientStatus: { desktop?: string|undefined; mobile?: string|undefined; web?: string|undefined; }; }>;
    constructor(data: GUILD_CREATE, client: Client<boolean>) {
        this.#client = client;
        this.afkChannel = {
            id: data.afk_channel_id ? BigInt(data.afk_channel_id) : null,
            timeout: data.afk_timeout,
        }
        this.applicationId = data.application_id;
        this.approx = {
            members: data.approximate_member_count,
            presences: data.approximate_presence_count,
        }
        this.banner = data.banner;
        this.channels = new Group(
            client.cacheOptions.guildChannels,
            data.channels.map(x => {
                const c = new Channel(x, data.id, client);
                return [c.id, c];
            })
        );
        this.defaultMessageNotifications = data.default_message_notifications;
        this.description = data.description;
        this.discoverySplash = data.discovery_splash;
        this.emojis = new Group(
            client.cacheOptions.guildEmojis,
            data.emojis.map(x => [x.id ? BigInt(x.id) : x.name, new Emoji(x, data.id, this.#client)]),
        );
        this.explicitContentFilter = data.explicit_content_filter;
        this.features = data.features;
        this.guildScheduledEvents = new Group(
            client.cacheOptions.guildScheduledEvents,
            data.guild_scheduled_events.map((x) => {
                const updatedParts = {
                    id: BigInt(x.id),
                    channelId: x.channel_id ? BigInt(x.channel_id) : null,
                    entityId: x.entity_id ? BigInt(x.entity_id) : null,
                    creatorId: x.creator_id ? BigInt(x.creator_id) : null,
                    creator: x.creator ? new User(x.creator, this.#client) : null,
                    guildId: BigInt(x.guild_id),
                }
                const data = { ...<Omit<SnakeToCamelCaseNested<GUILD_CREATE['guild_scheduled_events'][number]>, "id" | "entityId" | "channelId" | "creator" | "creatorId" | "guildId">>ConvertObjectToCamelCase(x), ...updatedParts }
                return [data.id, data];
            }
            )
        );
        this.icon = data.icon;
        this.iconHash = data.icon_hash;
        this.id = BigInt(data.id);
        this.joined = {
            at: new Date(data.joined_at),
            timestamp: new Date(data.joined_at).getTime(),
            toString() {
                return new Date(this.at).toString();
            }
        }
        this.large = data.large;
        this.marked = false;
        this.max = {
            members: data.max_members ?? null,
            presences: data.max_presences ?? null,
            videoChannelUsers: data.max_video_channel_users ?? null,
        }
        this.memberCount = data.member_count;
        this.members = new Group(
            client.cacheOptions.members,
            data.members.map(x => {
                const m = new Member(x, data.id, (<rawUserData>x.user).id, client);
                return [m.userId, m];
            })
        )
        this.mfaLevel = data.mfa_level;
        this.name = data.name;
        this.nsfw = data.nsfw_level;
        this.owner = data.owner;
        this.ownerId = BigInt(data.owner_id);
        this.permissions = {
            bits: data.permissions ? BigInt(data.permissions) : null,
            get array() {
                return parsePermissions(this.bits);
            }
        }
        this.preferredLocale = data.preferred_locale;
        this.premium = {
            progressBarEnabled: data.premium_progress_bar_enabled,
            subScriptionsCount: data.premium_subscription_count ?? 0,
            tier: data.premium_tier,
        }
        this.presences = new Group(
            client.cacheOptions.guildPresences,
            data.presences.map(x => {
                const p = <SnakeToCamelCaseNested<rawPresenceUpdateData>>ConvertObjectToCamelCase(x);
                const updatedParts = {
                    user: new User(p.user, client)
                };

                const d = { ...p, ...updatedParts };
                return [d.user.id, d];
            })
        );
        this.publicUpdatesChannelId = data.public_updates_channel_id ? BigInt(data.public_updates_channel_id) : undefined;
        this.roles = new Group(
            client.cacheOptions.roles,
            data.roles.map(x => {
                const r = new Role(x, data.id, client);
                return [r.id, r];
            })
        )
        this.rulesChannelId = data.rules_channel_id ? BigInt(data.rules_channel_id) : undefined;
        this.splash = data.splash;
        this.stageInstances = new Group(
            client.cacheOptions.guildStageInstances,
            data.stage_instances.map(x => {
                const si = <SnakeToCamelCaseNested<GUILD_CREATE['stage_instances'][number]>>ConvertObjectToCamelCase(x);
                const updatedParts = {
                    id: BigInt(si.id),
                    channelId: BigInt(si.channelId),
                    guildId: BigInt(si.guildId),
                    guildScheduledEventId: si.guildScheduledEventId ? BigInt(si.guildScheduledEventId) : null,
                }
                const data = { ...si, ...updatedParts };
                return [data.id, data]
            })
        );
        this.stickers = data.stickers ? new Group(
            client.cacheOptions.guildStickers,
            data.stickers.map(x => {
                const s = new Sticker(x, data.id, client);
                return [s.id, s];
            })
        ) : undefined;
        this.systemChannel = {
            id: data.system_channel_id ? BigInt(data.system_channel_id) : null,
            flags: data.system_channel_flags,
        }
        this.threads = new Group(
            client.cacheOptions.threads,
            data.threads.map(x => {
                const t = new Channel(x, data.id, client);
                return [t.id, t];
            })
        );
        this.unavailable = data.unavailable;
        this.vanityUrlCode = data.vanity_url_code;
        this.verificationLevel = data.verification_level;
        this.voiceStates = new Group(
            client.cacheOptions.guildVoiceStates,
            data.voice_states.map(x => {
                const vs = <SnakeToCamelCaseNested<rawVoiceStateData>>ConvertObjectToCamelCase(x);
                const updatedParts = {
                    channelId: vs.channelId ? BigInt(vs.channelId) : null,
                    guildId: BigInt(data.id),
                    userId: BigInt(vs.userId),
                    member: vs.member ? this.members.get(BigInt(vs.userId)) : undefined,
                };
                const d = { ...vs, ...updatedParts };
                return [d.userId, data];
            })
        );
        const welcome = data.welcome_screen ? <SnakeToCamelCaseNested<rawWelcomeData>>ConvertObjectToCamelCase(data.welcome_screen) : undefined
        if (!welcome) this.welcomeScreen = undefined;
        else {
            this.welcomeScreen = {
                description: welcome.description,
                welcomeChannels: welcome.welcomeChannels.map(x => {

                    const updatedParts = {
                        channelId: BigInt(x.channelId),
                        emojiId: x.emojiId ? BigInt(x.emojiId) : null,
                    }
                    return { ...x, ...updatedParts };
                })
            }
        }
        this.widget = {
            channelId: data.widget_channel_id ? BigInt(data.widget_channel_id) : null,
            enabled: data.widget_enabled ?? false,
        }
        this.rawData = data;
        this.clean();
    }
    clean() {
        const keys = Object.keys(this)
        for (const key of keys) {
            //@ts-ignore:key is from this
            if (this[key] === undefined) {
                //@ts-ignore:key is from this
                delete this[key];
            }
            //@ts-ignore:key is from this
            else if (this[key] instanceof Group && this[key].size === 0) {
                //@ts-ignore:key is from this
                delete this[key];
            }
        }
    }
    get byteSize() {
        return sizeOf(this);
    }
}
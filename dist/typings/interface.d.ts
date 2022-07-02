import ws from 'ws';
import { HttpMethod } from 'undici/types/dispatcher';
import { Group } from "../group/index";
import { Channel } from "../structures/channel";
import { Emoji } from "../structures/emoji";
import { Guild } from "../structures/guild";
import { Member, Role } from "../structures/index";
import { Message } from "../structures/message";
import { Sticker } from "../structures/sticker";
import { User } from "../structures/user";
import { Intents } from "./enums";
import { GUILD_CREATE, MESSAGE_CREATE } from "./eventInterfaces";
import { integer, SnakeToCamelCaseNested, Snowflake, snowflake } from "./types";
export interface WSData {
    op: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    d: unknown;
    s: integer | null;
    t: string | null;
}
export interface HelloOpData extends WSData {
    op: 10;
    d: {
        heartbeat_interval: number;
    };
}
export interface IdentifyData {
    token: string;
    properties: {
        os: string;
        browser: string;
        device: string;
    };
    compress?: boolean;
    large_threshold?: integer;
    shard?: [shardId: integer, shardCount: integer];
    presence?: {
        since?: integer | null;
        activities: Array<IdentifyActivity>;
        afk?: boolean;
        status: "online" | "offline" | "idle" | "dnd" | "invisible";
    };
    intents: number;
}
export interface IdentifyActivity {
    name: string;
    type: 0 | 1 | 2 | 3 | 4 | 5;
    url?: string;
}
export interface rawMessageData {
    id: snowflake;
    channel_id: snowflake;
    author: rawUserData;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions?: Array<rawUserData>;
    mention_roles?: Array<rawRoleData>;
    mention_channels?: Array<rawChannelMentionData>;
    attachments: Array<rawAttachmentData>;
    embeds: Array<rawEmbedData>;
}
export interface rawUserData {
    id: snowflake;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: integer | null;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: integer;
    premium_type?: integer;
    public_flags?: integer;
}
export interface rawRoleData {
    id: snowflake;
    name: string;
    color: integer;
    hoist: boolean;
    icon?: string | null;
    unicode_emoji?: string | null;
    position: integer;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: rawRoleTagData;
}
export interface rawRoleTagData {
    bot_id: snowflake;
    integration_id: snowflake;
    premium_subscriber?: boolean | null;
}
export interface rawChannelMentionData {
    id: snowflake;
    guild_id: snowflake;
    type: integer;
    name: string;
}
export interface rawAttachmentData {
    id: snowflake;
    filename: string;
    description?: string;
    content_type?: string;
    size: integer;
    url: string;
    proxy_url: string;
    height?: integer | null;
    width?: integer | null;
    ephemeral?: boolean;
}
export interface rawEmbedData {
    title?: string;
    type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
    description?: string;
    url?: string;
    timestamp?: string;
    color?: integer;
    footer?: rawEmbedFooterData;
    image?: rawEmbedImageData;
    thumbnail?: rawEmbedThumbnailData;
    video?: rawEmbedVideoData;
    provider?: rawEmbedProviderData;
    author?: rawEmbedAuthorData;
    fields?: Array<rawEmbedFieldData>;
}
export interface rawEmbedFooterData {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}
export interface rawEmbedImageData {
    url: string;
    height?: integer;
    width?: integer;
    proxy_url?: string;
}
export interface rawEmbedThumbnailData {
    url: string;
    height?: integer;
    width?: integer;
    proxy_url?: string;
}
export interface rawEmbedVideoData {
    url: string;
    height?: integer;
    width?: integer;
    proxy_url?: string;
}
export interface rawEmbedProviderData {
    name?: string;
    url?: string;
}
export interface rawEmbedAuthorData {
    name: string;
    icon_url?: string;
    proxy_icon_url?: string;
    url?: string;
}
export interface rawEmbedFieldData {
    name: string;
    value: string;
    inline?: boolean;
}
export interface ClientOptions {
    token: string;
    identifyOptions?: IdentifyOptions;
    wsOptions?: ws.ClientOptions;
    cacheOption?: {
        messages?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawMessageData> | Message>;
        guilds?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawGuildData> | Guild>;
        channels?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawChannelData> | Channel>;
        emojis?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawEmojiData> | Emoji>;
        users?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawUserData> | User>;
        threads?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawChannelData> | Channel>;
        guildChannels?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawChannelData> | Channel>;
        members?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawMemberData> | Member>;
        roles?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawRoleData> | Role>;
        guildPresences?: CacheOption<Snowflake, SnakeToCamelCaseNested<GUILD_CREATE['presences']>>;
        guildEmojis?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawEmojiData> | Emoji>;
        guildScheduledEvents?: CacheOption<Snowflake, SnakeToCamelCaseNested<GUILD_CREATE['guild_scheduled_events'][number]>>;
        emojiRoles?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawRoleData> | Role>;
        guildStageInstances?: CacheOption<Snowflake, SnakeToCamelCaseNested<GUILD_CREATE['stage_instances'][number]>>;
        guildStickers?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawStickerData> | Sticker>;
        stickers?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawStickerData> | Sticker>;
        guildVoiceStates?: CacheOption<Snowflake, SnakeToCamelCaseNested<rawVoiceStateData>>;
    };
    intents: Array<keyof typeof Intents> | number | "all";
}
export interface CacheOption<K, V> extends groupOptions {
    sweepFunc?: (val: V, _key: K, _msgMap: Group<K, V>) => boolean;
    cacheFunc: (val: V, _key: K) => boolean;
    interval: number;
}
export interface IdentifyOptions {
    properties?: IdentifyData["properties"];
    presence?: IdentifyData["presence"];
    largeThreshold?: IdentifyData["large_threshold"];
}
export interface rawMemberData {
    user?: rawUserData;
    nick?: string | null;
    avatar?: string | null;
    roles: Array<snowflake>;
    joined_at: string;
    premium_since?: string | null;
    deaf: boolean;
    mute: boolean;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: string | null;
}
export interface RoutedData {
    bucket: string;
    route: string;
    limit: number;
    remaining: number;
    reset: string;
    resetAfter: number;
}
export interface requestData {
    method: HttpMethod;
    auditLogReason?: string;
    url: string;
    route: string;
    params?: Record<string, unknown>;
}
export interface requestOption {
    method: HttpMethod;
    headers: Record<string, string>;
    body?: string;
}
export interface rawApplicationData {
    id: snowflake;
    name: string;
    icon: string | null;
    description: string;
    rpc_origins?: Array<string>;
    bot_public: boolean;
    bot_require_code_grant: boolean;
    terms_of_service_url?: string;
    privacy_policy_url?: string;
    owner?: rawUserData;
    summary: string;
    verify_key: string;
    team: rawTeamData | null;
    guild_id?: snowflake;
    primary_sku_id?: snowflake;
    slug?: string;
    cover_image?: string;
    flags?: integer;
    tags?: Array<string>;
    install_params?: {
        scopes: Array<string>;
        permissions: string;
    };
    custom_install_url?: string;
}
export interface rawTeamData {
    icon: string | null;
    id: snowflake;
    members: Array<rawTeamMemberData>;
    name: string;
    owner_user_id: snowflake;
}
export interface rawTeamMemberData {
    membership_state: integer;
    permissions: Array<string>;
    team_id: snowflake;
    user: rawUserData;
}
export interface rawGuildData {
    id: snowflake;
    name: string;
    icon: string | null;
    icon_hash?: string | null;
    splash: string | null;
    discovery_splash: string | null;
    owner?: boolean;
    owner_id: snowflake;
    permissions?: string;
    afk_channel_id: snowflake | null;
    afk_timeout: integer;
    widget_enabled?: boolean;
    widget_channel_id?: snowflake | null;
    verification_level: integer;
    default_message_notifications: integer;
    explicit_content_filter: integer;
    roles: Array<rawRoleData>;
    emojis: Array<rawEmojiData>;
    features: Array<string>;
    mfa_level: integer;
    application_id: snowflake | null;
    system_channel_id: snowflake | null;
    system_channel_flags: integer;
    rules_channel_id: snowflake | null;
    max_presences?: integer | null;
    max_members?: integer;
    vanity_url_code: string | null;
    description: string | null;
    banner: string | null;
    premium_tier: integer;
    premium_subscription_count?: integer;
    preferred_locale: string;
    public_updates_channel_id: snowflake | null;
    max_video_channel_users?: integer;
    approximate_member_count?: integer;
    approximate_presence_count?: integer;
    welcome_screen?: rawWelcomeData;
    nsfw_level: integer;
    stickers?: Array<rawStickerData>;
    premium_progress_bar_enabled: boolean;
}
export interface rawEmojiData {
    id: snowflake | null;
    name: string | null;
    roles?: Array<snowflake>;
    user?: rawUserData;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}
export interface rawWelcomeData {
    description: string | null;
    welcome_channels: {
        channel_id: snowflake;
        description: string;
        emoji_id: snowflake | null;
        emoji_name: string | null;
    }[];
}
export interface rawStickerData {
    id: snowflake;
    pack_id?: snowflake;
    name: string;
    description: string | null;
    tags: string;
    asset: string;
    type: integer;
    format_type: integer;
    available?: boolean;
    guild_id?: snowflake;
    user?: rawUserData;
    sort_value?: integer;
}
export interface rawVoiceStateData {
    guild_id?: snowflake;
    channel_id: snowflake | null;
    user_id: snowflake;
    member?: rawMemberData;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp: string | null;
}
export interface rawChannelData {
    id: snowflake;
    type: integer;
    guild_id?: snowflake;
    position?: integer;
    permission_overwrites?: Array<rawOverwriteData>;
    name?: string | null;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: snowflake | null;
    bitrate?: integer;
    user_limit?: integer;
    rate_limit_per_user?: integer;
    recipients?: Array<rawUserData>;
    icon?: string | null;
    owner_id?: snowflake;
    application_id?: snowflake;
    parent_id?: snowflake | null;
    last_pin_timestamp?: string | null;
    rtc_region?: string | null;
    video_quality_mode?: integer;
    message_count?: integer;
    member_count?: integer;
    thread_metadata?: rawThreadMetaData;
    member?: rawThreadMemberData;
    default_auto_archive_duration?: integer;
    permissions?: string;
    flags?: integer;
}
export interface rawThreadMetaData {
    archived: boolean;
    auto_archive_duration: integer;
    archive_timestamp: string;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: string | null;
}
export interface rawThreadMemberData {
    id?: snowflake;
    user_id?: snowflake;
    join_timestamp: string;
    flags: integer;
}
export interface rawOverwriteData {
    id: snowflake;
    type: 0 | 1;
    allow: string;
    deny: string;
}
export interface rawPresenceUpdateData {
    user: rawUserData;
    guild_id: snowflake;
    status: "idle" | "dnd" | "online" | "offline";
    activities: Array<rawActivityData>;
    client_status: rawClientStatusData;
}
export interface rawClientStatusData {
    desktop?: string;
    mobile?: string;
    web?: string;
}
export interface rawActivityData {
    name: string;
    type: integer;
    url?: string | null;
    created_at: integer;
    timestamps?: {
        start?: integer;
        end?: integer;
    };
    application_id?: snowflake;
    details?: string | null;
    state?: string | null;
    emoji?: rawEmojiData;
    party?: {
        id?: string;
        size?: [current_size: integer, max_size: integer];
    };
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
    secrets?: {
        join?: string;
        spectate?: string;
        match?: string;
    };
    instance?: boolean;
    flags?: integer;
    buttons?: {
        label: string;
        url: string;
    }[];
}
export interface rawStageInstanceData {
    id: snowflake;
    guild_id: snowflake;
    channel_id: snowflake;
    topic: string;
    privacy_level: integer;
    discoverable_disabled: boolean;
    guild_scheduled_event_id: snowflake | null;
}
export interface rawScheduledEventsData {
    id: snowflake;
    guild_id: snowflake;
    channel_id: snowflake | null;
    creator_id?: snowflake | null;
    name: string;
    description: string | null;
    scheduled_start_time: string;
    scheduled_end_time: string;
    privacy_level: integer;
    status: integer;
    entity_type: integer;
    entity_id: snowflake | null;
    entity_metadata: {
        location?: string;
    } | null;
    creator?: rawUserData;
    user_count?: integer;
    image?: string | null;
}
export interface rawCacheUserData extends rawUserData {
    guilds?: Array<Snowflake>;
    marked?: boolean;
}
export interface rawCacheChannelData extends rawChannelData {
    messages: rawChannelData["type"] extends 13 ? undefined : Group<Snowflake, SnakeToCamelCaseNested<MESSAGE_CREATE>>;
    marked?: boolean;
}
export interface rawCacheGuildData extends Omit<GUILD_CREATE, "channels" | "threads" | "members" | "presences" | "roles"> {
    channels: Group<Snowflake, SnakeToCamelCaseNested<rawCacheChannelData>>;
    threads: Group<Snowflake, SnakeToCamelCaseNested<rawCacheChannelData>>;
    members: Group<Snowflake, SnakeToCamelCaseNested<rawMemberData>>;
    presences: Group<Snowflake, SnakeToCamelCaseNested<GUILD_CREATE['presences'][number]>>;
    roles: Group<Snowflake, SnakeToCamelCaseNested<rawRoleData>>;
    marked?: boolean;
}
export interface groupOptions {
    limit: null | number;
    sweepType: "timedSweep" | "noSweep" | "priority" | "auto";
}
export interface ImageOptions {
    size?: number;
    animated?: boolean;
    format?: ".webp" | ".png" | ".jpg" | ".gif";
}
export interface modifyRawChannelData {
    name?: string;
    type?: integer;
    position?: null | integer;
    topic?: null | string;
    nsfw?: null | boolean;
    rate_limit_per_user?: null | integer;
    bitrate?: null | integer;
    user_limit?: null | integer;
    permission_overwrites?: Array<rawOverwriteData>;
    parent_id?: null | snowflake;
    rtc_region?: null | string;
    video_quality_mode?: null | integer;
    default_auto_archive_duration?: null | integer;
    icon?: string;
    reason?: string;
}
export interface modifyChannelData {
    name?: string;
    type?: integer;
    position?: null | integer;
    topic?: null | string;
    nsfw?: null | boolean;
    slowmode?: null | integer;
    bitrate?: null | integer;
    userLimit?: null | integer;
    permissionOverwrites?: Array<rawOverwriteData>;
    parentId?: null | snowflake;
    rtcRegion?: null | string;
    videoQualityMode?: null | integer;
    defaultAutoArchiveDuration?: null | integer;
    icon?: string;
    reason?: string;
}
//# sourceMappingURL=interface.d.ts.map
import { Group } from "../group/index.ts";
import { Channel } from "../structures/channel.ts";
import { Emoji } from "../structures/emoji.ts";
import { Guild } from "../structures/guild.ts";
import { Member, Role } from "../structures/index.ts";
import { Message } from "../structures/message.ts";
import { Sticker } from "../structures/sticker.ts";
import { User } from "../structures/user.ts";
import { Intents } from "./enums.ts";
import { GUILD_CREATE, MESSAGE_CREATE } from "./eventInterfaces.ts";
import { integer, SnakeToCamelCaseNested, Snowflake, snowflake } from "./types.ts";

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
  id: snowflake; //the user's id | identify
  username: string; //	the user's username, not unique across the platform | identify
  discriminator: string; //	the user's 4-digit discord-tag | identify
  avatar: string | null; //	the user's avatar hash | identify
  bot?: boolean; //	whether the user belongs to an OAuth2 application | identify
  system?: boolean; //whether the user is an Official Discord System user (part of the urgent message system) | identify
  mfa_enabled?: boolean; //	whether the user has two factor enabled on their account | identify
  banner?: string | null; // the user's banner hash | identify
  accent_color?: integer | null; //	the user's banner color encoded as an integer representation of hexadecimal color code | identify
  locale?: string; //	the user's chosen language option | identify
  verified?: boolean; //	whether the email on this account has been verified	email
  email?: string | null; //	the user's email | email
  flags?: integer; //	the flags on a user's account | identify
  premium_type?: integer; //	the type of Nitro subscription on a user's account | identify
  public_flags?: integer; //	the public flags on a user's account
}

export interface rawRoleData {
  id: snowflake; //	role id
  name: string; //	role name
  color: integer; //	integer representation of hexadecimal color code
  hoist: boolean; //	if this role is pinned in the user listing
  icon?: string | null; //	role icon hash
  unicode_emoji?: string | null; //	role unicode emoji
  position: integer; //	position of this role
  permissions: string; //	permission bit set
  managed: boolean; //	whether this role is managed by an integration
  mentionable: boolean; //	whether this role is mentionable
  tags?: rawRoleTagData; //	the tags this role has
}

export interface rawRoleTagData {
  bot_id: snowflake;
  integration_id: snowflake;
  premium_subscriber?: boolean | null;
}

export interface rawChannelMentionData {
  id: snowflake; //	id of the channel
  guild_id: snowflake; //	id of the guild containing the channel
  type: integer; //	the type of channel
  name: string; //	the name of the channel
}
export interface rawAttachmentData {
  id: snowflake; //	attachment id
  filename: string; //	name of file attached
  description?: string; //	description for the file
  content_type?: string; //	the attachment's media type
  size: integer; //	size of file in bytes
  url: string; //	source url of file
  proxy_url: string; //	a proxied url of file
  height?: integer | null; //	height of file (if image)
  width?: integer | null; //   width of file (if image)
  ephemeral?: boolean; //	whether this attachment is ephemeral
}

export interface rawEmbedData {
  title?: string; //	title of embed
  type?: "rich" | "image" | "video" | "gifv" | "article" | "link"; //	type of embed (always "rich" for webhook embeds)
  description?: string; //	description of embed
  url?: string; //	url of embed
  timestamp?: string; //	timestamp of embed content
  color?: integer; //	color code of the embed
  footer?: rawEmbedFooterData; //	footer information
  image?: rawEmbedImageData; //	image information
  thumbnail?: rawEmbedThumbnailData; //	thumbnail information
  video?: rawEmbedVideoData; //	video information for
  provider?: rawEmbedProviderData; //	provider information
  author?: rawEmbedAuthorData; //	author information about
  fields?: Array<rawEmbedFieldData>; //	fields information
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
  wsOptions?: {
    protocol: string | string[] | undefined;
  };
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
  intents: Array<keyof typeof Intents> | number | 'all';
}

export interface CacheOption<K, V> extends groupOptions {
  sweepFunc?: (
    val: V,
    _key: K,
    _msgMap: Group<K, V>,
  ) => boolean;
  cacheFunc: (val: V, _key: K) => boolean;
  interval: number;
}

export interface IdentifyOptions {
  properties?: IdentifyData["properties"];
  presence?: IdentifyData["presence"];
  largeThreshold?: IdentifyData["large_threshold"];
}

export interface rawMemberData {
  user?: rawUserData; //	the user this guild member represents
  nick?: string | null; //	this user's guild nickname
  avatar?: string | null; //	the member's guild avatar hash
  roles: Array<snowflake>; //	array of role object ids
  joined_at: string; //	when the user joined the guild
  premium_since?: string | null; //	when the user started boosting the guild
  deaf: boolean; //	whether the user is deafened in voice channels
  mute: boolean; //	whether the user is muted in voice channels
  pending?: boolean; //	whether the user has not yet passed the guild's Membership Screening requirements
  permissions?: string; //	total permissions of the member in the channel, including overwrites, returned when in the interaction object
  communication_disabled_until?: string | null; //	when the user's timeout will expire and the user will be able to communicate in the guild again, null or a time in the past if the user is not timed out
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
  method: RequestInit["method"];
  auditLogReason?: string;
  url: string;
  route: string;
  params?: Record<string, unknown>;
}
export interface requestOption {
  method: RequestInit["method"];
  headers: Record<string, string>;
  body?: string;
}

export interface rawApplicationData {
  id: snowflake; //	the id of the app
  name: string; //	the name of the app
  icon: string | null; //	the icon hash of the app
  description: string; //	the description of the app
  rpc_origins?: Array<string>; //	an array of rpc origin urls, if rpc is enabled
  bot_public: boolean; //	when false only app owner can join the app's bot to guilds
  bot_require_code_grant: boolean; //	when true the app's bot will only join upon completion of the full oauth2 code grant flow
  terms_of_service_url?: string; //	the url of the app's terms of service
  privacy_policy_url?: string; //	the url of the app's privacy policy
  owner?: rawUserData; //	partial user object containing info on the owner of the application
  summary: string; //	deprecated and will be removed in v11. An empty string.
  verify_key: string; //	the hex encoded key for verification in interactions and the GameSDK's GetTicket
  team: rawTeamData | null; //	if the application belongs to a team, this will be a list of the members of that team
  guild_id?: snowflake; //	if this application is a game sold on Discord, this field will be the guild to which it has been linked
  primary_sku_id?: snowflake; //	if this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists
  slug?: string; //	if this application is a game sold on Discord, this field will be the URL slug that links to the store page
  cover_image?: string; //	the application's default rich presence invite cover image hash
  flags?: integer; //	the application's public flags
  tags?: Array<string>; //	up to 5 tags describing the content and functionality of the application
  install_params?: { scopes: Array<string>; permissions: string }; //	settings for the application's default in-app authorization link, if enabled
  custom_install_url?: string; //	the application's default custom authorization link, if enabled
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
  id: snowflake; //	guild id
  name: string; //	guild name (2-100 characters, excluding trailing and leading whitespace)
  icon: string | null; //	icon hash
  icon_hash?: string | null; //	icon hash, returned when in the template object
  splash: string | null; //	splash hash
  discovery_splash: string | null; //	discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
  owner?: boolean; //	true if the user is the owner of the guild
  owner_id: snowflake; //	id of owner
  permissions?: string; //	total permissions for the user in the guild (excludes overwrites)
  afk_channel_id: snowflake | null; //	id of afk channel
  afk_timeout: integer; //	afk timeout in seconds
  widget_enabled?: boolean; //	true if the server widget is enabled
  widget_channel_id?: snowflake | null; //	the channel id that the widget will generate an invite to, or null if set to no invite
  verification_level: integer; //	verification level required for the guild
  default_message_notifications: integer; //	default message notifications level
  explicit_content_filter: integer; //	explicit content filter level
  roles: Array<rawRoleData>; //	roles in the guild
  emojis: Array<rawEmojiData>; //	custom guild emojis
  features: Array<string>; //	enabled guild features
  mfa_level: integer; //	required MFA level for the guild
  application_id: snowflake | null; //	application id of the guild creator if it is bot-created
  system_channel_id: snowflake | null; //	the id of the channel where guild notices such as welcome messages and boost events are posted
  system_channel_flags: integer; //	system channel flags
  rules_channel_id: snowflake | null; //	the id of the channel where Community guilds can display rules and/or guidelines
  max_presences?: integer | null; //	the maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
  max_members?: integer; //	the maximum number of members for the guild
  vanity_url_code: string | null; //	the vanity url code for the guild
  description: string | null; //	the description of a guild
  banner: string | null; //	banner hash
  premium_tier: integer; //	premium tier (Server Boost level)
  premium_subscription_count?: integer; //	the number of boosts this guild currently has
  preferred_locale: string; //	the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US"
  public_updates_channel_id: snowflake | null; //	the id of the channel where admins and moderators of Community guilds receive notices from Discord
  max_video_channel_users?: integer; //	the maximum amount of users in a video channel
  approximate_member_count?: integer; //	approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
  approximate_presence_count?: integer; //	approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is true
  welcome_screen?: rawWelcomeData; //	the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
  nsfw_level: integer; //	guild NSFW level
  stickers?: Array<rawStickerData>; //	custom guild stickers
  premium_progress_bar_enabled: boolean; //	whether the guild has the boost progress bar enabled
}
export interface rawEmojiData {
  id: snowflake | null; //	emoji id
  name: string | null; // (can be null only in reaction emoji objects)	emoji name
  roles?: Array<snowflake>; // ids	roles allowed to use this emoji
  user?: rawUserData; //	user that created this emoji
  require_colons?: boolean; //	whether this emoji must be wrapped in colons
  managed?: boolean; //	whether this emoji is managed
  animated?: boolean; //	whether this emoji is animated
  available?: boolean; //	whether this emoji can be used, may be false due to loss of Server Boosts
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
  id: snowflake; //	id of the sticker
  pack_id?: snowflake; //	for standard stickers, id of the pack the sticker is from
  name: string; //	name of the sticker
  description: string | null; //	description of the sticker
  tags: string; //	autocomplete/suggestion tags for the sticker (max 200 characters)
  asset: string; //	Deprecated previously the sticker asset hash, now an empty string
  type: integer; //	type of sticker
  format_type: integer; //	type of sticker format
  available?: boolean; //	whether this guild sticker can be used, may be false due to loss of Server Boosts
  guild_id?: snowflake; //	id of the guild that owns this sticker
  user?: rawUserData; //	the user that uploaded the guild sticker
  sort_value?: integer; //	the standard sticker's sort order within its pack
}
export interface rawVoiceStateData {
  guild_id?: snowflake; //	the guild id this voice state is for
  channel_id: snowflake | null; //	the channel id this user is connected to
  user_id: snowflake; //	the user id this voice state is for
  member?: rawMemberData; //	the guild member this voice state is for
  session_id: string; //	the session id for this voice state
  deaf: boolean; //	whether this user is deafened by the server
  mute: boolean; //	whether this user is muted by the server
  self_deaf: boolean; //	whether this user is locally deafened
  self_mute: boolean; //	whether this user is locally muted
  self_stream?: boolean; //	whether this user is streaming using "Go Live"
  self_video: boolean; //	whether this user's camera is enabled
  suppress: boolean; //	whether this user is muted by the current user
  request_to_speak_timestamp: string | null; //	the time at which the user requested to speak
}

export interface rawChannelData {
  id: snowflake; //	the id of this channel
  type: integer; //	the type of channel
  guild_id?: snowflake; //	the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
  position?: integer; //	sorting position of the channel
  permission_overwrites?: Array<rawOverwriteData>; //	explicit permission overwrites for members and roles
  name?: string | null; //	the name of the channel (1-100 characters)
  topic?: string | null; //	the channel topic (0-1024 characters)
  nsfw?: boolean; //	whether the channel is nsfw
  last_message_id?: snowflake | null; //	the id of the last message sent in this channel (or thread for GUILD_FORUM channels) (may not point to an existing or valid message or thread)
  bitrate?: integer; //	the bitrate (in bits) of the voice channel
  user_limit?: integer; //	the user limit of the voice channel
  rate_limit_per_user?: integer; //	amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected
  recipients?: Array<rawUserData>; //	the recipients of the DM
  icon?: string | null; //	icon hash of the group DM
  owner_id?: snowflake; //	id of the creator of the group DM or thread
  application_id?: snowflake; //	application id of the group DM creator if it is bot-created
  parent_id?: snowflake | null; //	for guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created
  last_pin_timestamp?: string | null; //	when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned.
  rtc_region?: string | null; //	voice region id for the voice channel, automatic when set to null
  video_quality_mode?: integer; //	the camera video quality mode of the voice channel, 1 when not present
  message_count?: integer; //	an approximate count of messages in a thread, stops counting at 50
  member_count?: integer; //	an approximate count of users in a thread, stops counting at 50
  thread_metadata?: rawThreadMetaData; //	thread-specific fields not needed by other channels
  member?: rawThreadMemberData; //	thread member object for the current user, if they have joined the thread, only included on certain API endpoints
  default_auto_archive_duration?: integer; //	default duration that the clients (not the API) will use for newly created threads, in minutes, to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
  permissions?: string; //	computed permissions for the invoking user in the channel, including overwrites, only included when part of the resolved data received on a slash command interaction
  flags?: integer; //	channel flags combined as a bitfield
}
export interface rawThreadMetaData {
  archived: boolean; //	whether the thread is archived
  auto_archive_duration: integer; //	duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
  archive_timestamp: string; //	timestamp when the thread's archive status was last changed, used for calculating recent activity
  locked: boolean; //	whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it
  invitable?: boolean; //	whether non-moderators can add other non-moderators to a thread; only available on private threads
  create_timestamp?: string | null; //	timestamp when the thread was created; only populated for threads created after 2022-01-09
}

export interface rawThreadMemberData {
  id?: snowflake; //	the id of the thread
  user_id?: snowflake; //	the id of the user
  join_timestamp: string; //	the time the current user last joined the thread
  flags: integer; //	any user-thread settings, currently only used for notifications
}

export interface rawOverwriteData {
  id: snowflake; //	role or user id
  type: 0 | 1; //	either 0 (role) or 1 (member)
  allow: string; //	permission bit set
  deny: string; //	permission bit set
}

export interface rawPresenceUpdateData {
  user: rawUserData; //	the user presence is being updated for
  guild_id: snowflake; //	id of the guild
  status: "idle" | "dnd" | "online" | "offline";
  activities: Array<rawActivityData>; //	user's current activities
  client_status: rawClientStatusData; //	user's platform-dependent status
}

export interface rawClientStatusData {
  desktop?: string; //	the user's status set for an active desktop (Windows, Linux, Mac) application session
  mobile?: string; //	the user's status set for an active mobile (iOS, Android) application session
  web?: string; //	the user's status set for an active web (browser, bot account) application session
}

export interface rawActivityData {
  name: string; //	the activity's name
  type: integer; //	activity type
  url?: string | null; //	stream url, is validated when type is 1
  created_at: integer; //	unix timestamp (in milliseconds) of when the activity was added to the user's session
  timestamps?: {
    start?: integer; //	unix time (in milliseconds) of when the activity started
    end?: integer; //	unix time (in milliseconds) of when the activity ends
  };
  application_id?: snowflake; //	application id for the game
  details?: string | null; //	what the player is currently doing
  state?: string | null; //	the user's current party status
  emoji?: rawEmojiData; //	the emoji used for a custom status
  party?: {
    id?: string; //	the id of the party
    size?: [current_size: integer, max_size: integer]; //	used to show the party's current and maximum size
  };
  assets?: {
    large_image?: string; //	see Activity Asset Image
    large_text?: string; //	text displayed when hovering over the large image of the activity
    small_image?: string; //	see Activity Asset Image
    small_text?: string; //	text displayed when hovering over the small image of the activity
  };
  secrets?: {
    join?: string; //	the secret for joining a party
    spectate?: string; //	the secret for spectating a game
    match?: string; //	the secret for a specific instanced match
  };
  instance?: boolean; //	whether or not the activity is an instanced game session
  flags?: integer; //	activity flags ORd together, describes what the payload includes
  buttons?: {
    label: string; //	the text shown on the button (1-32 characters)
    url: string; //	the url opened when clicking the button (1-512 characters)
  }[];
}

export interface rawStageInstanceData {
  id: snowflake; //	The id of this Stage instance
  guild_id: snowflake; //	The guild id of the associated Stage channel
  channel_id: snowflake; //	The id of the associated Stage channel
  topic: string; //	The topic of the Stage instance (1-120 characters)
  privacy_level: integer; //	The privacy level of the Stage instance
  discoverable_disabled: boolean; //	Whether or not Stage Discovery is disabled (deprecated)
  guild_scheduled_event_id: snowflake | null; //	The id of the scheduled event for this Stage instance
}

export interface rawScheduledEventsData {
  id: snowflake; //	the id of the scheduled event
  guild_id: snowflake; //	the guild id which the scheduled event belongs to
  channel_id: snowflake | null; //	the channel id in which the scheduled event will be hosted, or null if scheduled entity type is EXTERNAL
  creator_id?: snowflake | null; //	the id of the user that created the scheduled event *
  name: string; //	the name of the scheduled event (1-100 characters)
  description: string | null; //	the description of the scheduled event (1-1000 characters)
  scheduled_start_time: string; //	the time the scheduled event will start
  scheduled_end_time: string; //	the time the scheduled event will end, required if entity_type is EXTERNAL
  privacy_level: integer; //	the privacy level of the scheduled event
  status: integer; //	event status	the status of the scheduled event
  entity_type: integer; //	the type of the scheduled event
  entity_id: snowflake | null; //	the id of an entity associated with a guild scheduled event
  entity_metadata: { location?: string } | null; //	additional metadata for the guild scheduled event
  creator?: rawUserData; //	the user that created the scheduled event
  user_count?: integer; //	the number of users subscribed to the scheduled event
  image?: string | null; //	the cover image hash of the scheduled event
}

export interface rawCacheUserData extends rawUserData {
  guilds?: Array<Snowflake>;
  marked?: boolean;
}

export interface rawCacheChannelData extends rawChannelData {
  messages: rawChannelData["type"] extends 13 ? undefined
  : Group<Snowflake, SnakeToCamelCaseNested<MESSAGE_CREATE>>;
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
  name?: string;//	1 - 100 character channel name	All;
  type?: integer;//	the type of channel; only conversion between text and news is supported and only in guilds with the "NEWS" feature	Text, News;
  position?: null | integer;//	the position of the channel in the left - hand listing	All;
  topic?: null | string;//	0 - 1024 character channel topic	Text, News;
  nsfw?: null | boolean;//	whether the channel is nsfw	Text, Voice, News;
  rate_limit_per_user?: null | integer;//	amount of seconds a user has to wait before sending another message( 0 - 21600 ); bots, as well as users with the permission manage_messages or manage_channel, are unaffected	Text;
  bitrate?: null | integer;//	the bitrate(in bits ) of the voice or stage channel; min 8000	Voice, Stage;
  user_limit?: null | integer;//	the user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit	Voice;
  permission_overwrites?: Array<rawOverwriteData>;//	channel or category - specific permissions	All;
  parent_id?: null | snowflake;//	id of the new parent category for a channel	Text, Voice, News
  rtc_region?: null | string;//	channel voice region id, automatic when set to null	Voice, Stage;
  video_quality_mode?: null | integer;//	the camera video quality mode of the voice channel	Voice;
  default_auto_archive_duration?: null | integer;//	the default duration that the clients use( not the API ) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity;
  icon?: string;//	base64 encoded icon;
  reason?: string//
}


export interface modifyChannelData {
  name?: string;//	1 - 100 character channel name	All;
  type?: integer;//	the type of channel; only conversion between text and news is supported and only in guilds with the "NEWS" feature	Text, News;
  position?: null | integer;//	the position of the channel in the left - hand listing	All;
  topic?: null | string;//	0 - 1024 character channel topic	Text, News;
  nsfw?: null | boolean;//	whether the channel is nsfw	Text, Voice, News;
  slowmode?: null | integer;//	amount of seconds a user has to wait before sending another message( 0 - 21600 ); bots, as well as users with the permission manage_messages or manage_channel, are unaffected	Text;
  bitrate?: null | integer;//	the bitrate(in bits ) of the voice or stage channel; min 8000	Voice, Stage;
  userLimit?: null | integer;//	the user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit	Voice;
  permissionOverwrites?: Array<rawOverwriteData>;//	channel or category - specific permissions	All;
  parentId?: null | snowflake;//	id of the new parent category for a channel	Text, Voice, News
  rtcRegion?: null | string;//	channel voice region id, automatic when set to null	Voice, Stage;
  videoQualityMode?: null | integer;//	the camera video quality mode of the voice channel	Voice;
  defaultAutoArchiveDuration?: null | integer;//	the default duration that the clients use( not the API ) for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity;
  icon?: string;//	base64 encoded icon;
  reason?: string;//
}
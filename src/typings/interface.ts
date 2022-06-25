import { HttpMethod } from "undici/types/dispatcher";
import ws from "ws";
import { Events, Intents } from "./enums";
import { integer, snowflake } from "./types";

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
  mentions: Array<rawUserData>;
  mention_roles: Array<rawRoleData>;
  mention_channels: Array<rawChannelMentionData>;
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
  ppremium_subscriber?: boolean | null;
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
export interface rawEmbedThumbnailData extends rawEmbedImageData {}
export interface rawEmbedVideoData extends rawEmbedThumbnailData {}

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
  intents: Array<keyof typeof Intents>;
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
  members:Array<rawTeamMemberData>;
  name:string;
  owner_user_id:snowflake;
}

export interface rawTeamMemberData {
  membership_state: integer;
  permissions: Array<string>;
  team_id: snowflake;
  user: rawUserData;
}
import * as pack from "../package.ts";
export const userAgent =
  `DiscordBot (${pack.homepage}, ${pack.version})` as const;

export const api = (link: string) => `https://discord.com/api/v10/${link}`;

export const Permissions = {
  CreateInstantInvite: 1 << 0,
  KickMembers: 1 << 1,
  BanMembers: 1 << 2,
  Admin: 1 << 3,
  ManageChannels: 1 << 4,
  ManageGuild: 1 << 5,
  AddReactions: 1 << 6,
  ViewAuditLog: 1 << 7,
  PrioritySpeaker: 1 << 8,
  Stream: 1 << 9,
  ViewChannel: 1 << 10,
  SendMessges: 1 << 11,
  SendTTSMessages: 1 << 12,
  ManageMessages: 1 << 13,
  EmbedLinks: 1 << 14,
  AttachFiles: 1 << 15,
  ReadMessageHistory: 1 << 16,
  MentionEveryone: 1 << 17,
  UseExternalEmojis: 1 << 18,
  ViewGuildInsights: 1 << 19,
  Connect: 1 << 20,
  Speak: 1 << 21,
  MuteMembers: 1 << 22,
  DeafenMembers: 1 << 23,
  MoveMembers: 1 << 24,
  UseVad: 1 << 25,
  ChangeNickname: 1 << 26,
  ManageNicknames: 1 << 27,
  ManageRoles: 1 << 28,
  ManageWebhooks: 1 << 29,
  ManageEmojisAndStickers: 1 << 30,
  UseApplicationCommands: 1n << 31n,
  RequestToSpeak: 1n << 32n,
  ManageEvents: 1n << 33n,
  ManageThreads: 1n << 34n,
  CreatePublicThreads: 1n << 35n,
  CreatePrivateThreads: 1n << 36n,
  UseExternalStickers: 1n << 37n,
  SendMessagesInThreads: 1n << 38n,
  UseEmbeddedActivities: 1n << 39n,
  ModerateMembers: 1n << 40n,
};

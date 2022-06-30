import * as pack from "../package.ts";
export const userAgent =
	`DiscordBot (${pack.homepage}, ${pack.version})` as const;

export const api = (link: string) => `https://discord.com/api/v10/${link}`;
export const imageUrl = (...data: unknown[]) => `https://cdn.discordapp.com/${data.join("/")}`

export const Permissions = {
	CreateInstantInvite: 2 ** 0,
	KickMembers: 2 ** 1,
	BanMembers: 2 ** 2,
	Admin: 2 ** 3,
	ManageChannels: 2 ** 4,
	ManageGuild: 2 ** 5,
	AddReactions: 2 ** 6,
	ViewAuditLog: 2 ** 7,
	PrioritySpeaker: 2 ** 8,
	Stream: 2 ** 9,
	ViewChannel: 2 ** 10,
	SendMessges: 2 ** 11,
	SendTTSMessages: 2 ** 12,
	ManageMessages: 2 ** 13,
	EmbedLinks: 2 ** 14,
	AttachFiles: 2 ** 15,
	ReadMessageHistory: 2 ** 16,
	MentionEveryone: 2 ** 17,
	UseExternalEmojis: 2 ** 18,
	ViewGuildInsights: 2 ** 19,
	Connect: 2 ** 20,
	Speak: 2 ** 21,
	MuteMembers: 2 ** 22,
	DeafenMembers: 2 ** 23,
	MoveMembers: 2 ** 24,
	UseVad: 2 ** 25,
	ChangeNickname: 2 ** 26,
	ManageNicknames: 2 ** 27,
	ManageRoles: 2 ** 28,
	ManageWebhooks: 2 ** 29,
	ManageEmojisAndStickers: 2 ** 30,
	UseApplicationCommands: 2 ** 31,
	RequestToSpeak: 2 ** 32,
	ManageEvents: 2 ** 33,
	ManageThreads: 2 ** 34,
	CreatePublicThreads: 2 ** 35,
	CreatePrivateThreads: 2 ** 36,
	UseExternalStickers: 2 ** 37,
	SendMessagesInThreads: 2 ** 38,
	UseEmbeddedActivities: 2 ** 39,
	ModerateMembers: 2 ** 40
};
export const PermOverWritesType = ['Role', 'Member'] as const;
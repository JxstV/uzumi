import { Client } from "../client/client.ts";
import { Group } from "../group/index.ts";
import { rawChannelData } from "../typings/interface.ts";
import { SnakeToCamelCaseNested, snowflake } from "../typings/types.ts";
import { PermOverWritesType } from "../utils/constants.ts";
import { ConvertObjectToCamelCase, parsePermissions } from "../utils/functions.ts";
import { Message } from "./message.ts";
import { User } from "./user.ts";

export class Channel {
    applicationId?: string | undefined;
    bitrate?: number | undefined;
    defaultAutoArchiveDuration?: number | undefined;
    flags?: number | undefined;
    guildId: bigint;
    icon?: string | null | undefined;
    id: bigint;
    lastMessageId?: bigint | undefined;
    lastPinTimestamp?: string | null | undefined;
    marked: boolean;
    member: SnakeToCamelCaseNested<rawChannelData['member']>
    memberCount?: number | undefined;
    messages?: Group<bigint, Message>;
    name?: string | null | undefined;
    nsfw?: boolean | undefined;
    ownerId?: bigint;
    parentId?: string | bigint | null | undefined;
    permissionOverwrites?: Group<bigint, { id: bigint; type: "Role" | "Member"; allow: { bits: bigint | null; readonly array: string[]; }; deny: { bits: bigint | null; readonly array: string[]; }; }> | undefined;
    permissions: { bits: bigint | null; readonly array: string[]; };
    position?: number | undefined;
    slowMode?: number | undefined;
    recipients?: Group<bigint, User> | undefined;
    rtcRegion?: string | null | undefined;
    threadMetaData?: SnakeToCamelCaseNested<rawChannelData['thread_metadata']>
    topic?: string | null | undefined;
    type: number;
    userLimit?: number | undefined;
    videoQualityMode?: number | undefined;
    rawData: rawChannelData;
#client: Client<boolean>;
    constructor(data: rawChannelData, guild: snowflake, client: Client<boolean>) {
        this.#client = client
        this.applicationId = data.application_id;
        this.bitrate = data.bitrate;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.flags = data.flags;
        this.guildId = BigInt(data.guild_id ?? guild);
        this.icon = data.icon;
        this.id = BigInt(data.id);
        this.lastMessageId = data.last_message_id ? BigInt(data.last_message_id) : undefined;
        this.lastPinTimestamp = data.last_pin_timestamp;
        this.marked = false;
        this.member = data.member ? <SnakeToCamelCaseNested<rawChannelData['member']>>ConvertObjectToCamelCase(data.member) : undefined;
        this.memberCount = data.member_count;
        this.messages = data.type !== 13 ? new Group(
            client.cacheOptions.messages
        ) : undefined;
        this.name = data.name;
        this.nsfw = data.nsfw;
        this.ownerId = data.owner_id ? BigInt(data.owner_id) : undefined;
        this.parentId = data.parent_id ? BigInt(data.parent_id) : data.parent_id;
        this.permissionOverwrites = data.permission_overwrites ? new Group(
            { limit: null, sweepType: 'noSweep' },
            data.permission_overwrites.map(x => {
                const data = {
                    id: BigInt(x.id),
                    type: PermOverWritesType[x.type],
                    allow: {
                        bits: typeof x.allow === 'string' ? BigInt(x.allow) : null,
                        get array() {
                            return parsePermissions(this.bits);
                        }
                    },
                    deny: {
                        bits: typeof x.deny === 'string' ? BigInt(x.deny) : null,
                        get array() {
                            return parsePermissions(this.bits);
                        }
                    }
                }
                return [data.id, data]
            })
        ) : undefined;
        this.permissions = {
            bits: typeof data.permissions === 'string' ? BigInt(data.permissions) : null,
            get array() {
                return parsePermissions(this.bits);
            }
        };
        this.position = data.position;
        this.slowMode = data.rate_limit_per_user;
        this.recipients = data.recipients ? new Group(
            { limit: null, sweepType: 'noSweep' },
            data.recipients.map(x => {
                const user = new User(x, client);
                return [user.id, user];
            }),
        ) : undefined;
        this.rtcRegion = data.rtc_region;
        this.threadMetaData = data.thread_metadata  ? <SnakeToCamelCaseNested<rawChannelData['thread_metadata']>>ConvertObjectToCamelCase(data.thread_metadata) : undefined;
        this.topic = data.topic;
        this.type = data.type;
        this.userLimit = data.user_limit;
        this.videoQualityMode = data.video_quality_mode;
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
    toString() {
        return `<#${this.id}>`
    }
}
import { rawUserData, requestData } from './../typings/interface';
import { requestApi } from "../api/request";
import { Client } from "../client/client";
import { ImageOptions, rawMemberData } from "../typings/interface";
import { snowflake } from "../typings/types";
import { api, imageUrl } from "../utils/constants";
import { parsePermissions, sizeOf } from "../utils/functions";
import { User } from './user';

export class Member
{
    #client: Client<boolean>;
    avatar?: string | null | undefined;
    timeout?: string | null | undefined;
    deaf: boolean;
    joined: { at: Date | null; timestamp: number; toString (): string; };
    mute: boolean;
    nick?: string | null | undefined;
    pending?: boolean | undefined;
    permissions: { bits: bigint | null; readonly array: string[]; };
    premium: { since: string | null; timestamp: number; toString (): string; };
    roles: bigint[];
    rawData: rawMemberData;
    guildId: bigint;
    userId: bigint;
    constructor ( data: rawMemberData, guild: snowflake, user: snowflake, client: Client<boolean> )
    {
        this.#client = client;
        this.avatar = data.avatar;
        this.guildId = BigInt( guild );
        this.timeout = data.communication_disabled_until;
        this.deaf = data.deaf;
        this.joined = {
            at: data.joined_at ? new Date( data.joined_at ) : null,
            timestamp: data.joined_at ? new Date( data.joined_at ).getTime() : 0,
            toString ()
            {
                return this.at ? this.at.toString() : "";
            }
        };
        this.mute = data.mute;
        this.nick = data.nick;
        this.pending = data.pending;
        this.permissions = {
            bits: typeof data.permissions === 'string' ? BigInt( data.permissions ) : null,
            get array ()
            {
                return parsePermissions( this.bits );
            }
        };
        this.premium = {
            since: data.premium_since ?? null,
            timestamp: data.premium_since ? new Date( data.premium_since ).getTime() : 0,
            toString ()
            {
                return data.premium_since ? new Date( data.premium_since ).toString() : "";
            }
        };
        this.roles = data.roles.map( x => BigInt( x ) );
        this.userId = BigInt( user );
        this.rawData = data;
        this.clean();
    }
    clean ()
    {
        const keys = Object.keys( this );
        for ( const key of keys )
        {
            //@ts-ignore:key is from this
            if ( this[ key ] === undefined )
                //@ts-ignore:key is from this
                delete this[ key ];
        }
    }
    toString ()
    {
        return `<@${ this.userId }>`;
    }
    get byteSize ()
    {
        return sizeOf( this.rawData );
    }
    async getUser ()
    {
        let res = <User> this.#client.cache?.users?.get( this.userId );
        if ( !this.rawData.user )
        {
            if ( !res )
            {
                const data: requestData = {
                    url: api( `users/${ this.userId }` ),
                    route: `users/${ this.userId }`,
                    method: 'GET',
                };
                const reqData: rawUserData = await requestApi( data, this.#client );
                res = new User( reqData, this.#client );
                this.#client.cache?.users?.set( res.id, res );
            }
        } else
        {
            if ( !res )
            {
                res = new User( this.rawData.user, this.#client );
                this.#client.cache?.users?.set( res.id, res );
            }
        }
        return res;
    }
    avatarUrl ( { size = 4096, animated = true, format = ".webp" }: ImageOptions = {} )
    {
        if ( !this.avatar ) return null;
        else if ( this.avatar.startsWith( "a_" ) )
        {
            if ( animated ) return imageUrl( "guilds", this.guildId, "users", this.userId, "avatars", this.avatar, ".gif", "?size=", size );
        } else
        {
            return imageUrl( "guilds", this.guildId, "users", this.userId, "avatars", this.avatar, format, "?size=", size );
        }
    }
    // bannerUrl({ size = 4096, animated = true, format = ".webp" }: ImageOptions = {}) {
    //     if (!this.banner) return null;
    //     else if (this.banner.startsWith("a_")) {
    //         if (animated) return imageUrl("banners", this.id, this.banner, ".gif", "?size=", size);
    //     } else {
    //         return imageUrl("banners", this.id, this.banner, format, "?size=", size)
    //     }
    // }
}
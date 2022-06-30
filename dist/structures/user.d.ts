import { Client } from "../client/client";
import { ImageOptions, rawUserData } from "../typings/interface";
import { Snowflake } from "../typings/types";
export declare class User {
    #private;
    accentColor?: number | null | undefined;
    avatar?: string | null;
    banner?: string | null | undefined;
    bot: boolean;
    discriminator: string;
    email?: string | null | undefined;
    flags?: number | undefined;
    id: Snowflake;
    locale?: string | undefined;
    mfaEnabled: boolean;
    premiumType?: number | undefined;
    system: boolean;
    username: string;
    verified?: boolean | undefined;
    marked: boolean;
    rawData: rawUserData;
    guilds: Snowflake[];
    constructor(data: rawUserData, client: Client<boolean>);
    clean(): void;
    toString(): string;
    get tag(): string;
    get hexAccentColor(): string;
    avatarUrl({ size, animated, format }?: ImageOptions): string | null | undefined;
    bannerUrl({ size, animated, format }?: ImageOptions): string | null | undefined;
    get byteSize(): number;
}
//# sourceMappingURL=user.d.ts.map
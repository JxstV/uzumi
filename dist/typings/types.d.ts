import { Group } from "../group/index";
import { Events } from "./enums";
export declare type integer = number;
export declare type Snowflake = bigint;
export declare type snowflake = string;
export declare type AyayaEvents = keyof typeof Events;
export declare type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamelCase<U>>}` : S;
export declare type SnakeToCamelCaseNested<T> = T extends Array<object> ? Array<{
    [K in keyof T[number] as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[number][K]>;
}> : T extends Array<unknown> ? T : T extends Function ? T : T extends Group<unknown, unknown> ? T : T extends object ? {
    [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>;
} : T;
export declare type CamelToSnakeCase<S extends string> = S extends `${infer T}${Capitalize<infer U>}` ? `${T}_${Lowercase<U>}` : S;
export declare type CamelToSnakeCaseNested<T> = T extends Array<object> ? Array<{
    [K in keyof T[number] as CamelToSnakeCase<K & string>]: CamelToSnakeCaseNested<T[number][K]>;
}> : T extends Array<unknown> ? T : T extends Function ? T : T extends Group<unknown, unknown> ? T : T extends object ? {
    [K in keyof T as CamelToSnakeCase<K & string>]: CamelToSnakeCaseNested<T[K]>;
} : T;
//# sourceMappingURL=types.d.ts.map
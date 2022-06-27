// deno-lint-ignore-file ban-unused-ignore no-explicit-any ban-types
import { Group } from "../group/index.ts";
import { Events } from "./enums.ts";
export type integer = number;
export type Snowflake = bigint;
export type snowflake = string;
export type AyayaEvents = keyof typeof Events;
export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

//deno-lint-ignore ban-types
export type SnakeToCamelCaseNested<T> = T extends Array<object> ? {
  [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<
    T[K]
  >;
}: T extends Array<unknown> ? T : T extends Function ? T : T extends Group<any, any> ? T : T extends object
  ? {
    [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<
      T[K]
    >;
  }
  : T;

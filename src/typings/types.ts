// deno-lint-ignore-file ban-unused-ignore no-explicit-any ban-types
import { Group } from "../group";
import { Events } from "./enums";
export type integer = number;
export type Snowflake = bigint;
export type snowflake = string;
export type AyayaEvents = keyof typeof Events;
export type SnakeToCamelCase<S extends string> = S extends `${ infer T }_${ infer U }`
  ? `${ T }${ Capitalize<SnakeToCamelCase<U>> }`
  : S;

//deno-lint-ignore ban-types
export type SnakeToCamelCaseNested<T> = T extends Array<object> ? Array<{
  [ K in keyof T[ number ]as SnakeToCamelCase<K & string> ]: SnakeToCamelCaseNested<
    T[ number ][ K ]
  >;
}> : T extends Array<unknown> ? T : T extends Function ? T : T extends Group<unknown, unknown> ? T : T extends object
? {
  [ K in keyof T as SnakeToCamelCase<K & string> ]: SnakeToCamelCaseNested<
    T[ K ]
  >;
}
: T;

export type CamelToSnakeCase<S extends string> = S extends `${ infer T }${ Capitalize<infer U> }` ? `${ T }_${ Lowercase<U> }` : S;
export type CamelToSnakeCaseNested<T> = T extends Array<object> ? Array<{
  [ K in keyof T[ number ]as CamelToSnakeCase<K & string> ]: CamelToSnakeCaseNested<
    T[ number ][ K ]
  >;
}> : T extends Array<unknown> ? T : T extends Function ? T : T extends Group<unknown, unknown> ? T : T extends object
? {
  [ K in keyof T as CamelToSnakeCase<K & string> ]: CamelToSnakeCaseNested<
    T[ K ]
  >;
}
: T;
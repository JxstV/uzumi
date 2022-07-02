"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagetobase64 = exports.sizeOf = exports.parsePermissions = exports.cleanObject = exports.ConvertObjectToCamelCase = exports.ConvertObjectToSnakeCase = exports.convertEventstoPascalCase = exports.toSnakeCase = exports.toCamelCase = void 0;
const undici_1 = require("undici");
const v8_1 = __importDefault(require("v8"));
const constants_1 = require("./constants");
function toCamelCase(value) {
    return value.replaceAll(/[-_][a-z]/g, ($1) => {
        return $1.toUpperCase().replace("_", "").replace("-", "");
    });
}
exports.toCamelCase = toCamelCase;
function toSnakeCase(value) {
    return value.replaceAll(/[A-Z]/g, ($1) => {
        return `_${$1.toLowerCase()}`;
    });
}
exports.toSnakeCase = toSnakeCase;
function convertEventstoPascalCase(value) {
    return (value[0] +
        value
            .slice(1)
            .toLowerCase()
            .replaceAll(/[_][a-z]/g, ($1) => {
            return $1.toUpperCase().replace("_", "");
        }));
}
exports.convertEventstoPascalCase = convertEventstoPascalCase;
function ConvertObjectToSnakeCase(object) {
    let res = {};
    const keys = Object.keys(object);
    for (const key of keys) {
        if (typeof object[key] === "object" &&
            !Array.isArray(object[key]) &&
            object[key] !== null) {
            res[toSnakeCase(key)] = ConvertObjectToSnakeCase(object[key]);
        }
        else {
            res[toSnakeCase(key)] = object[key];
        }
    }
    return res;
}
exports.ConvertObjectToSnakeCase = ConvertObjectToSnakeCase;
function ConvertObjectToCamelCase(object) {
    if (typeof object !== 'object')
        return object;
    // deno-lint-ignore no-explicit-any
    const res = {};
    const keys = Object.keys(object);
    for (const key of keys) {
        if (typeof object[key] === "object" &&
            object[key] !== null) {
            if (!Array.isArray(object[key])) {
                res[toCamelCase(key)] = ConvertObjectToCamelCase(
                // deno-lint-ignore no-explicit-any
                object[key]);
            }
            else {
                res[toCamelCase(key)] = object[key].map(ConvertObjectToCamelCase);
            }
        }
        else {
            res[toCamelCase(key)] = object[key];
        }
    }
    return res;
}
exports.ConvertObjectToCamelCase = ConvertObjectToCamelCase;
function cleanObject(object) {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        if (typeof object[keys[i]] === "object" &&
            !Array.isArray(object[keys[i]]) &&
            object[keys[i]] !== null) {
            object[keys[i]] = cleanObject(object[keys[i]]);
        }
        else if (typeof object[keys[i]] === "undefined")
            delete object[keys[i]];
    }
    return object;
}
exports.cleanObject = cleanObject;
function parsePermissions(bit) {
    if (bit === null)
        return [];
    const keys = Object.keys(constants_1.Permissions);
    const binary = bit.toString(2);
    const array = [];
    let i = binary.length;
    let u = 0;
    while (i--) {
        if (binary[u]) {
            //@ts-ignore: x is key from Permissions
            array.push(keys.find(x => constants_1.Permissions[x] === 2 ** u));
        }
        u++;
    }
    return array;
}
exports.parsePermissions = parsePermissions;
function sizeOf(data) {
    return v8_1.default.serialize(data).byteLength;
}
exports.sizeOf = sizeOf;
async function imagetobase64(url) {
    const data = await (0, undici_1.fetch)(url);
    return data.headers.get('content-type') + ";base64;" + Buffer.from(await data.arrayBuffer()).toString('base64');
}
exports.imagetobase64 = imagetobase64;
//# sourceMappingURL=functions.js.map
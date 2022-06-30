"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermissions = exports.cleanObject = exports.ConvertObjectToCamelCase = exports.ConvertObjectToSnakeCase = exports.convertEventstoPascalCase = exports.toSnakeCase = exports.toCamelCase = void 0;
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
    const keys = Object.keys(Permissions);
    const binary = bit.toString(2);
    const array = [];
    let i = binary.length;
    let u = 0;
    while (i--) {
        if (binary[u]) {
            //@ts-ignore: x is key from Permissions
            array.push(keys.find(x => Permissions[x] === 2 ** u));
        }
        u++;
    }
    return array;
}
exports.parsePermissions = parsePermissions;
//# sourceMappingURL=functions.js.map
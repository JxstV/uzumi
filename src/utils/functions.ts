export function toCamelCase(value: string): string {
  return value.replaceAll(/[-_][a-z]/g, ($1) => {
    return $1.toUpperCase().replace("_", "").replace("-", "");
  });
}

export function toSnakeCase(value: string): string {
  return value.replaceAll(/[A-Z]/g, ($1) => {
    return `_${$1.toLowerCase()}`;
  });
}

export function convertEventstoPascalCase(value: string): string {
  return (
    value[0] +
    value
      .slice(1)
      .toLowerCase()
      .replaceAll(/[_][a-z]/g, ($1) => {
        return $1.toUpperCase().replace("_", "");
      })
  );
}

export function ConvertObjectToSnakeCase(object: Record<string, unknown>) {
  const res: Record<string, unknown> = {};
  const keys = Object.keys(object);
  for (const key of keys) {
    if (
      typeof object[key] === "object" &&
      !Array.isArray(object[key]) &&
      object[key] !== null
    ) {
      res[toSnakeCase(key)] = ConvertObjectToSnakeCase(
        <Record<string, unknown>>object[key],
      );
    } else {
      res[toSnakeCase(key)] = object[key];
    }
  }
  return res;
}

// deno-lint-ignore no-explicit-any
export function ConvertObjectToCamelCase(object: Record<string, any>) {
  if(typeof object !== 'object') return object;
  // deno-lint-ignore no-explicit-any
  const res: Record<string, any> = {};
  const keys = Object.keys(object);
  for (const key of keys) {
    if (
      typeof object[key] === "object" &&
      object[key] !== null
    ) {
      if(!Array.isArray(object[key])) {
      res[toCamelCase(key)] = ConvertObjectToCamelCase(
        // deno-lint-ignore no-explicit-any
        <Record<string, any>>object[key],
      );
      } else {
        res[toCamelCase(key)] = object[key].map(ConvertObjectToCamelCase);
      }
    } else {
      res[toCamelCase(key)] = object[key];
    }
  }
  return res;
}

// deno-lint-ignore no-explicit-any
export function cleanObject(object: Record<string, any>) {
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    if (
      typeof object[keys[i]] === "object" &&
      !Array.isArray(object[keys[i]]) &&
      object[keys[i]] !== null
    ) {
      object[keys[i]] = cleanObject(object[keys[i]]);
    } else if (typeof object[keys[i]] === "undefined") delete object[keys[i]];
  }
  return object;
}

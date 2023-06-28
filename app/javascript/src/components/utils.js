export const toCamelCase = key =>
  key.replace(/([_][a-z])/g, group => group.toUpperCase().replace("_", ""));

export const isObject = object =>
  object === Object(object) &&
  !Array.isArray(object) &&
  typeof object !== "function";

export const allKeysToCamelCase = data => {
  if (isObject(data)) {
    const camelCaseObject = {};

    Object.keys(data).forEach(key => {
      camelCaseObject[toCamelCase(key)] = allKeysToCamelCase(data[key]);
    });

    return camelCaseObject;
  } else if (Array.isArray(data)) {
    return data.map(element => allKeysToCamelCase(element));
  }

  return data;
};

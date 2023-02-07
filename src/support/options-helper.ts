const optionsIncludeString = (
  string: string,
  options: readonly string[]
): Boolean => {
  return options.includes(string);
};

export const stringIsOfOptions = (
  stringLevel: string,
  options: readonly string[]
) => {
  if (optionsIncludeString(stringLevel, options)) {
    return stringLevel;
  }
  throw Error(`String ${stringLevel} needs to be of ${options}`);
};

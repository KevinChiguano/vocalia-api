export const normalizeBigInt = (value: any): any => {
  if (typeof value === "bigint") {
    return Number(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeBigInt);
  }

  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeBigInt(v)]),
    );
  }

  return value;
};

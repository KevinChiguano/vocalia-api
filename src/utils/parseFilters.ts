// Boolean: ?active=true | false
export function parseBoolean(value: any): boolean | undefined {
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
}

// String limpio: ?search=torneo
export function parseString(value: any): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length > 0 ? v : undefined;
}

// Number: ?page=1 | ?limit=10
export function parseNumber(
  value: any,
  options?: { min?: number; max?: number }
): number | undefined {
  const n = Number(value);
  if (isNaN(n)) return undefined;

  if (options?.min !== undefined && n < options.min) return undefined;
  if (options?.max !== undefined && n > options.max) return undefined;

  return n;
}

// Date: ?startFrom=2025-01-01
export function parseDate(value: any): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

// Date range: startFrom / startTo
export function parseDateRange(from?: any, to?: any) {
  const startFrom = parseDate(from);
  const startTo = parseDate(to);

  if (!startFrom && !startTo) return undefined;

  return {
    ...(startFrom && { gte: startFrom }),
    ...(startTo && { lte: startTo }),
  };
}

// Enum: ?status=ACTIVE
export function parseEnum<T extends string>(
  value: any,
  allowed: readonly T[]
): T | undefined {
  return allowed.includes(value) ? value : undefined;
}

// Array: ?status=ACTIVE,INACTIVE
export function parseArray(value: any): string[] | undefined {
  if (typeof value !== "string") return undefined;

  const arr = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  return arr.length > 0 ? arr : undefined;
}

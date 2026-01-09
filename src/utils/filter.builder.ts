// utils/filter.builder.ts

export function buildSearchFilter(search?: string, fields: string[] = []) {
  if (!search || fields.length === 0) return undefined;

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive",
      },
    })),
  };
}

export function buildDateRangeFilter(
  field: string,
  from?: string,
  to?: string
) {
  if (!from && !to) return undefined;

  const range: any = {};
  if (from) range.gte = new Date(from);
  if (to) range.lte = new Date(to);

  return { [field]: range };
}

export function buildNumberRangeFilter(
  field: string,
  min?: number,
  max?: number
) {
  if (min === undefined && max === undefined) return undefined;

  const range: any = {};
  if (min !== undefined) range.gte = min;
  if (max !== undefined) range.lte = max;

  return { [field]: range };
}

export function buildBooleanFilter(field: string, value?: boolean) {
  if (typeof value !== "boolean") return undefined;

  return { [field]: value };
}

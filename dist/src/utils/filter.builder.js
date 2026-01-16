// utils/filter.builder.ts
export function buildSearchFilter(search, fields = []) {
    if (!search || fields.length === 0)
        return undefined;
    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive",
            },
        })),
    };
}
export function buildDateRangeFilter(field, from, to) {
    if (!from && !to)
        return undefined;
    const range = {};
    if (from)
        range.gte = new Date(from);
    if (to)
        range.lte = new Date(to);
    return { [field]: range };
}
export function buildNumberRangeFilter(field, min, max) {
    if (min === undefined && max === undefined)
        return undefined;
    const range = {};
    if (min !== undefined)
        range.gte = min;
    if (max !== undefined)
        range.lte = max;
    return { [field]: range };
}
export function buildBooleanFilter(field, value) {
    if (typeof value !== "boolean")
        return undefined;
    return { [field]: value };
}

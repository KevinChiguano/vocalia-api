export const normalizeBigInt = (value) => {
    if (typeof value === "bigint") {
        return Number(value);
    }
    if (Array.isArray(value)) {
        return value.map(normalizeBigInt);
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeBigInt(v)]));
    }
    return value;
};

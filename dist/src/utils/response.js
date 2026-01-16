import { normalizeBigInt } from "./normalizeBigInt";
export const ok = (data) => ({
    success: true,
    data: normalizeBigInt(data),
});
export const fail = (error) => ({
    success: false,
    error,
});

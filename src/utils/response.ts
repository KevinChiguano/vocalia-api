import { normalizeBigInt } from "./normalizeBigInt";

export const ok = (data: any) => ({
  success: true,
  data: normalizeBigInt(data),
});

export const fail = (error: any) => ({
  success: false,
  error,
});

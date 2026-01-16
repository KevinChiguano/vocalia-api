import { describe, it, expect } from "vitest";
import { loginSchema } from "@/modules/auth/auth.schema";
describe("auth.schema - loginSchema", () => {
    it("debe validar un payload correcto", () => {
        const payload = {
            email: "test@email.com",
            password: "123456",
        };
        const result = loginSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });
    it("debe fallar si el email no es válido", () => {
        const payload = {
            email: "correo-no-valido",
            password: "123456",
        };
        const result = loginSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it("debe fallar si el password es muy corto", () => {
        const payload = {
            email: "test@email.com",
            password: "123",
        };
        const result = loginSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
    it("debe fallar si faltan campos", () => {
        const payload = {
            email: "test@email.com",
        };
        const result = loginSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
});

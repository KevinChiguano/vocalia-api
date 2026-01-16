import { describe, it, expect, vi } from "vitest";
import { authController } from "@/modules/auth/auth.controller";
import { authService } from "@/modules/auth/auth.service";
vi.mock("@/modules/auth/auth.service", () => ({
    authService: {
        login: vi.fn(),
    },
}));
describe("auth.controller - login", () => {
    it("debe retornar 401 si las credenciales son inválidas", async () => {
        const req = {
            body: { email: "test@mail.com", password: "123456" },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        authService.login.mockResolvedValue(null);
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
    });
    it("debe retornar ok si el login es correcto", async () => {
        const req = {
            body: { email: "test@mail.com", password: "123456" },
        };
        const res = {
            json: vi.fn(),
        };
        authService.login.mockResolvedValue({
            user: { id: 1 },
            token: "token",
        });
        await authController.login(req, res);
        expect(res.json).toHaveBeenCalled();
    });
});

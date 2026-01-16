import { describe, it, expect, vi } from "vitest";
import { roleGuard } from "@/middlewares/role.guard";
const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn();
    return res;
};
const next = vi.fn();
describe("roleGuard", () => {
    it("should return 401 if no user", () => {
        const req = {};
        const res = mockRes();
        roleGuard(["ADMIN"])(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("should return 403 if role not allowed", () => {
        const req = { user: { rol: "USER" } };
        const res = mockRes();
        roleGuard(["ADMIN"])(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("should call next if role allowed", () => {
        const req = { user: { rol: "ADMIN" } };
        const res = mockRes();
        roleGuard(["ADMIN"])(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

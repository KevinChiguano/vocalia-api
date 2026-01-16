import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateSchema } from "@/middlewares/validateSchema";
const schema = z.object({
    name: z.string(),
});
const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn();
    return res;
};
const next = vi.fn();
describe("validateSchema", () => {
    it("should call next if body is valid", () => {
        const req = { body: { name: "Kevin" } };
        const res = mockRes();
        validateSchema(schema)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("should return 400 if body is invalid", () => {
        const req = { body: {} };
        const res = mockRes();
        validateSchema(schema)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

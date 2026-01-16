import { describe, it, expect } from "vitest";
import { ok, fail } from "@/utils/response";
describe("response utils", () => {
    it("ok retorna success true", () => {
        const result = ok({ id: 1 });
        expect(result).toEqual({
            success: true,
            data: { id: 1 },
        });
    });
    it("fail retorna success false", () => {
        const result = fail("error");
        expect(result).toEqual({
            success: false,
            error: "error",
        });
    });
});

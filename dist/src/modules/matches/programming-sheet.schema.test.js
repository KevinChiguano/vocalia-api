import { describe, it, expect } from "vitest";
import { programmingSheetSchema } from "./match.schema";
describe("programmingSheetSchema", () => {
    const validData = {
        tournamentId: 1,
        stage: "Etapa Clasificatoria",
        matchDay: 1,
        rows: [
            {
                matchDate: "2026-01-20",
                time: "19:00",
                localTeamId: 1,
                awayTeamId: 2,
                category: "Primera",
                vocalUserId: 10,
            },
        ],
    };
    it("should validate a correct programming sheet", () => {
        const result = programmingSheetSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
    it("should fail if tournamentId is missing or 0", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            tournamentId: 0,
        });
        expect(result.success).toBe(false);
    });
    it("should fail if matchDay is missing or 0", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            matchDay: 0,
        });
        expect(result.success).toBe(false);
    });
    it("should fail if rows are empty", () => {
        const result = programmingSheetSchema.safeParse({ ...validData, rows: [] });
        expect(result.success).toBe(false);
    });
    it("should fail if localTeamId is 0", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            rows: [{ ...validData.rows[0], localTeamId: 0 }],
        });
        expect(result.success).toBe(false);
    });
    it("should fail if awayTeamId is 0", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            rows: [{ ...validData.rows[0], awayTeamId: 0 }],
        });
        expect(result.success).toBe(false);
    });
    it("should fail if vocalUserId is 0", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            rows: [{ ...validData.rows[0], vocalUserId: 0 }],
        });
        expect(result.success).toBe(false);
    });
    it("should fail if time format is invalid", () => {
        const result = programmingSheetSchema.safeParse({
            ...validData,
            rows: [{ ...validData.rows[0], time: "invalid-time" }],
        });
        expect(result.success).toBe(false);
    });
});

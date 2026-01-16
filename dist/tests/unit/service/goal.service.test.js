import { describe, it, expect, vi, beforeEach } from "vitest";
import { goalService } from "@/modules/goals/goal.service";
import { goalRepository } from "@/modules/goals/goal.repository";
import { invalidateStatsByMatch } from "@/utils/cache.stats";
/* =======================
   Mocks
======================= */
vi.mock("@/modules/goals/goal.repository", () => ({
    goalRepository: {
        create: vi.fn(),
        createMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findById: vi.fn(),
        deleteByMatchId: vi.fn(),
    },
}));
vi.mock("@/utils/cache.stats", () => ({
    invalidateStatsByMatch: vi.fn(),
}));
/* =======================
   Setup
======================= */
beforeEach(() => {
    vi.clearAllMocks();
});
/* =======================
   Tests
======================= */
describe("GoalService", () => {
    describe("create()", () => {
        it("crea un gol correctamente e invalida stats", async () => {
            goalRepository.create.mockResolvedValue({
                goal_id: 1,
                is_own_goal: false,
                event_time: new Date(),
                player: null,
                match: null,
            });
            const result = await goalService.create({
                matchId: 1,
                playerId: 2,
                eventTime: new Date().toISOString(),
            });
            expect(result).not.toBeNull();
            expect(invalidateStatsByMatch).toHaveBeenCalledWith(1);
        });
        it("NO invalida stats si existe tx", async () => {
            goalRepository.create.mockResolvedValue({});
            await goalService.create({
                matchId: 1,
                playerId: 2,
                eventTime: new Date().toISOString(),
            }, {});
            expect(invalidateStatsByMatch).not.toHaveBeenCalled();
        });
    });
    describe("createBulk()", () => {
        it("lanza error si el arreglo está vacío", async () => {
            await expect(goalService.createBulk([])).rejects.toThrow("El arreglo de goles está vacío.");
        });
        it("crea goles en bulk e invalida stats", async () => {
            goalRepository.createMany.mockResolvedValue({ count: 2 });
            const result = await goalService.createBulk([
                {
                    matchId: 1,
                    playerId: 10,
                    eventTime: new Date().toISOString(),
                },
                {
                    matchId: 1,
                    playerId: 11,
                    eventTime: new Date().toISOString(),
                },
            ]);
            expect(result.count).toBe(2);
            expect(invalidateStatsByMatch).toHaveBeenCalledWith(1);
        });
    });
    describe("update()", () => {
        it("lanza error si no hay datos para actualizar", async () => {
            await expect(goalService.update(1, {})).rejects.toThrow("No hay datos para actualizar.");
        });
        it("actualiza el gol correctamente", async () => {
            goalRepository.update.mockResolvedValue({
                goal_id: 1,
                is_own_goal: true,
                event_time: new Date(),
                player: null,
                match: null,
            });
            const result = await goalService.update(1, { isOwnGoal: true });
            expect(result.isOwnGoal).toBe(true);
        });
    });
    describe("getById()", () => {
        it("devuelve null si no existe", async () => {
            goalRepository.findById.mockResolvedValue(null);
            const result = await goalService.getById(99);
            expect(result).toBeNull();
        });
    });
    describe("delete()", () => {
        it("elimina un gol", async () => {
            goalRepository.delete.mockResolvedValue({});
            await goalService.delete(1);
            expect(goalRepository.delete).toHaveBeenCalledWith(1, undefined);
        });
    });
    describe("deleteByMatch()", () => {
        it("elimina goles por partido", async () => {
            goalRepository.deleteByMatchId.mockResolvedValue({ count: 3 });
            const result = await goalService.deleteByMatch(1);
            expect(goalRepository.deleteByMatchId).toHaveBeenCalledWith(1, undefined);
            expect(result.count).toBe(3);
        });
    });
});

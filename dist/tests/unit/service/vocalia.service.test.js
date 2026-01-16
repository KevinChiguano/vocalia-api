import { describe, it, expect, vi, beforeEach } from "vitest";
import { vocaliaService } from "@/modules/vocalias/vocalia.service";
import { vocaliaRepository } from "@/modules/vocalias/vocalia.repository";
import prisma from "@/config/prisma";
import { invalidateTournamentStats } from "@/utils/cache.stats";
/* =======================
   Mocks
======================= */
vi.mock("@/modules/vocalias/vocalia.repository", () => ({
    vocaliaRepository: {
        findByMatchId: vi.fn(),
        create: vi.fn(),
        findByMatchAndVocal: vi.fn(),
        update: vi.fn(),
    },
}));
vi.mock("@/config/prisma", () => ({
    default: {
        $transaction: vi.fn(),
    },
}));
vi.mock("@/utils/cache.stats", () => ({
    invalidateTournamentStats: vi.fn(),
}));
/* =======================
   Helpers
======================= */
const mockTx = {
    vocalias: {
        findUnique: vi.fn(),
    },
    matches: {
        update: vi.fn(),
    },
    tournament_teams: {
        findUnique: vi.fn(),
        update: vi.fn(),
    },
};
beforeEach(() => {
    vi.clearAllMocks();
});
/* =======================
   Tests
======================= */
describe("VocaliaService", () => {
    describe("create()", () => {
        it("lanza error si ya existe vocalía para el partido", async () => {
            vocaliaRepository.findByMatchId.mockResolvedValue({});
            await expect(vocaliaService.create({ matchId: 1, vocalUserId: 2 })).rejects.toThrow("Este partido ya tiene vocal asignado.");
        });
        it("crea vocalía correctamente", async () => {
            vocaliaRepository.findByMatchId.mockResolvedValue(null);
            vocaliaRepository.create.mockResolvedValue({
                vocalia_id: 1,
                match_id: 1n,
                vocal_user_id: 2n,
                created_at: new Date(),
                vocalia_data: {},
                match: null,
            });
            const result = await vocaliaService.create({
                matchId: 1,
                vocalUserId: 2,
            });
            expect(result).not.toBeNull();
            expect(result.matchId).toBe(1);
            expect(result.vocalUserId).toBe(2);
        });
    });
    describe("update()", () => {
        it("lanza error si no es el vocal asignado", async () => {
            vocaliaRepository.findByMatchAndVocal.mockResolvedValue(null);
            await expect(vocaliaService.update(1, { observations: "test" }, 99)).rejects.toThrow("No tiene permisos para modificar esta vocalía.");
        });
        it("actualiza la vocalía correctamente", async () => {
            vocaliaRepository.findByMatchAndVocal.mockResolvedValue({});
            vocaliaRepository.update.mockResolvedValue({
                vocalia_id: 1,
                match_id: 1n,
                observations: "ok",
                created_at: new Date(),
                vocalia_data: {},
                match: null,
            });
            const result = await vocaliaService.update(1, { observations: "ok" }, 10);
            expect(result).not.toBeNull();
            expect(result.observations).toBe("ok");
        });
    });
    describe("finalize()", () => {
        it("lanza error si el marcador es negativo", async () => {
            await expect(vocaliaService.finalize(1, { localScore: -1, awayScore: 0 })).rejects.toThrow("El marcador no puede ser negativo.");
        });
        it("lanza error si la vocalía no existe", async () => {
            prisma.$transaction.mockImplementation(async (cb) => {
                mockTx.vocalias.findUnique.mockResolvedValue(null);
                return cb(mockTx);
            });
            await expect(vocaliaService.finalize(1, { localScore: 1, awayScore: 0 })).rejects.toThrow("No existe vocalía.");
        });
        it("lanza error si el partido ya fue finalizado", async () => {
            prisma.$transaction.mockImplementation(async (cb) => {
                mockTx.vocalias.findUnique.mockResolvedValue({
                    match: { status: "finalizado" },
                });
                return cb(mockTx);
            });
            await expect(vocaliaService.finalize(1, { localScore: 1, awayScore: 0 })).rejects.toThrow("El partido ya fue finalizado.");
        });
        it("finaliza partido y asigna puntos correctamente (gana local)", async () => {
            prisma.$transaction.mockImplementation(async (cb) => {
                mockTx.vocalias.findUnique.mockResolvedValue({
                    match: {
                        status: "programado",
                        tournament_id: 1n,
                        local_team_id: 10n,
                        away_team_id: 20n,
                    },
                });
                mockTx.tournament_teams.findUnique
                    .mockResolvedValueOnce({ tournament_team_id: 100 })
                    .mockResolvedValueOnce({ tournament_team_id: 200 });
                mockTx.matches.update.mockResolvedValue({});
                mockTx.tournament_teams.update.mockResolvedValue({});
                return cb(mockTx);
            });
            const result = await vocaliaService.finalize(1, {
                localScore: 2,
                awayScore: 1,
            });
            expect(result.status).toBe("finalizado");
            expect(invalidateTournamentStats).toHaveBeenCalledWith(1);
        });
    });
    describe("getByMatchId()", () => {
        it("lanza error si no existe vocalía", async () => {
            vocaliaRepository.findByMatchId.mockResolvedValue(null);
            await expect(vocaliaService.getByMatchId(1)).rejects.toThrow("No existe vocalía para este partido.");
        });
    });
});

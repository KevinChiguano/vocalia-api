import { describe, it, expect, vi, beforeEach } from "vitest";
import { matchService } from "@/modules/matches/match.service";
import { matchRepository } from "@/modules/matches/match.repository";
import { paginate } from "@/utils/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

vi.mock("@/modules/matches/match.repository");
vi.mock("@/utils/pagination");

describe("MatchService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create()", () => {
    it("crea un partido correctamente", async () => {
      (matchRepository.create as any).mockResolvedValue({
        match_id: 1,
        match_date: new Date(),
        stage: "final",
        location: "Quito",
        status: "programado",
        local_score: 0,
        away_score: 0,
        video_url: null,
        category: "Primera",
        localTeam: null,
        awayTeam: null,
        tournament: null,
      });

      const result = await matchService.create({
        tournamentId: 1,
        localTeamId: 2,
        awayTeamId: 3,
        stage: "final",
        category: "Primera",
        matchDay: 1,
        matchDate: new Date(),
      });

      expect(result).toMatchObject({
        id: 1,
        stage: "final",
        localScore: 0,
        awayScore: 0,
        category: "Primera",
      });
    });
  });

  describe("update()", () => {
    it("actualiza un partido", async () => {
      (matchRepository.update as any).mockResolvedValue({
        match_id: 1,
        match_date: new Date(),
        stage: "semifinal",
        location: "Guayaquil",
        status: "jugado",
        local_score: 2,
        away_score: 1,
        video_url: null,
        category: "Primera",
        localTeam: null,
        awayTeam: null,
        tournament: null,
      });

      const result = await matchService.update(1, {
        stage: "semifinal",
        localScore: 2,
        awayScore: 1,
      });

      expect(result?.stage).toBe("semifinal");
      expect(result?.localScore).toBe(2);
      expect(result?.awayScore).toBe(1);
    });

    it("lanza error si el partido no existe", async () => {
      (matchRepository.update as any).mockRejectedValue(
        new PrismaClientKnownRequestError("Not found", {
          code: "P2025",
          clientVersion: "5.x",
        }),
      );

      await expect(matchService.update(99, { stage: "final" })).rejects.toThrow(
        "El partido con ID 99 no existe.",
      );
    });
  });

  describe("delete()", () => {
    it("elimina un partido correctamente", async () => {
      (matchRepository.delete as any).mockResolvedValue(undefined);

      const result = await matchService.delete(1);

      expect(result).toBe("Partido eliminado exitosamente.");
    });

    it("lanza error si no existe", async () => {
      (matchRepository.delete as any).mockRejectedValue(
        new PrismaClientKnownRequestError("Not found", {
          code: "P2025",
          clientVersion: "5.x",
        }),
      );

      await expect(matchService.delete(99)).rejects.toThrow(
        "El partido con ID 99 no fue encontrado para eliminar.",
      );
    });
  });

  describe("getById()", () => {
    it("retorna un partido mapeado", async () => {
      (matchRepository.findById as any).mockResolvedValue({
        match_id: 1,
        match_date: new Date(),
        stage: "final",
        location: "Quito",
        status: "programado",
        local_score: 0,
        away_score: 0,
        video_url: null,
        category: "Primera",
        localTeam: null,
        awayTeam: null,
        tournament: null,
      });

      const result = await matchService.getById(1);

      expect(result?.id).toBe(1);
      expect(result?.stage).toBe("final");
    });

    it("retorna null si no existe", async () => {
      (matchRepository.findById as any).mockResolvedValue(null);

      const result = await matchService.getById(99);

      expect(result).toBeNull();
    });
  });

  describe("list()", () => {
    it("retorna partidos paginados", async () => {
      (paginate as any).mockResolvedValue({
        items: [
          {
            match_id: 1,
            match_date: new Date(),
            stage: "final",
            location: "Quito",
            status: "programado",
            local_score: 1,
            away_score: 0,
            video_url: null,
            category: "Primera",
            localTeam: null,
            awayTeam: null,
            tournament: null,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

      const result = await matchService.list(1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.items[0]!.id).toBe(1);
    });
  });
});

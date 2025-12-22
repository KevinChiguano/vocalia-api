import { describe, it, expect, vi, beforeEach } from "vitest";
import { statisticsService } from "@/modules/statistics/statistics.service";
import { statisticsRepository } from "@/modules/statistics/statistics.repository";
import prisma from "@/config/prisma";
import { redis } from "@/config/redis";

/* =======================
   Mocks
======================= */

vi.mock("@/modules/statistics/statistics.repository", () => ({
  statisticsRepository: {
    playersByTournament: vi.fn(),
    countPlayersByTournament: vi.fn(),
    goalsByPlayer: vi.fn(),
    sanctionsByPlayer: vi.fn(),
    matchesPlayedByPlayer: vi.fn(),
    teamsByTournament: vi.fn(),
    sanctionsBase: vi.fn(),
    topScorers: vi.fn(),
  },
}));

vi.mock("@/config/redis", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("@/config/prisma", () => ({
  default: {
    players: {
      findMany: vi.fn(),
    },
  },
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

describe("StatisticsService", () => {
  describe("playersStatsByTournament()", () => {
    it("retorna datos desde cache si existe", async () => {
      (redis.get as any).mockResolvedValue(
        JSON.stringify({ items: [], pagination: {} })
      );

      const result = await statisticsService.playersStatsByTournament(1);

      expect(redis.get).toHaveBeenCalled();
      expect(result.items).toEqual([]);
    });

    it("calcula stats y guarda en cache si no existe", async () => {
      (redis.get as any).mockResolvedValue(null);

      (statisticsRepository.playersByTournament as any).mockResolvedValue([
        {
          player_id: 1,
          player_name: "Juan",
          player_lastname: "Perez",
          player_number: 9,
          team: { team_id: 10, team_name: "Team A" },
        },
      ]);

      (statisticsRepository.countPlayersByTournament as any).mockResolvedValue(1);

      (statisticsRepository.goalsByPlayer as any).mockResolvedValue([
        { player_id: 1, _count: { player_id: 3 } },
      ]);

      (statisticsRepository.matchesPlayedByPlayer as any).mockResolvedValue([
        { player_id: 1, _count: { match_id: 2 } },
      ]);

      (statisticsRepository.sanctionsByPlayer as any).mockResolvedValue([
        { player_id: 1, type: "amarilla", _count: { type: 1 } },
      ]);

      const result = await statisticsService.playersStatsByTournament(1);

      expect(result.items[0].goals).toBe(3);
      expect(result.items[0].matchesPlayed).toBe(2);
      expect(result.items[0].yellowCards).toBe(1);
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe("teamsStatsByTournament()", () => {
    it("calcula correctamente tarjetas por equipo", async () => {
      (statisticsRepository.teamsByTournament as any).mockResolvedValue([
        {
          team_id: 10,
          team: { team_name: "Team A" },
          played: 1,
          won: 1,
          drawn: 0,
          lost: 0,
          goals_for: 2,
          goals_against: 1,
          goal_diff: 1,
          points: 3,
        },
      ]);

      (statisticsRepository.sanctionsBase as any).mockResolvedValue([
        { player_id: 1, type: "amarilla", _count: { type: 2 } },
        { player_id: 2, type: "roja_directa", _count: { type: 1 } },
      ]);

      (prisma.players.findMany as any).mockResolvedValue([
        { player_id: 1, team_id: 10 },
        { player_id: 2, team_id: 10 },
      ]);

      const result = await statisticsService.teamsStatsByTournament(1);

      expect(result[0].yellowCards).toBe(2);
      expect(result[0].redCards).toBe(1);
    });
  });

  describe("topScorersByTournament()", () => {
    it("retorna goleadores con equipo", async () => {
      (statisticsRepository.topScorers as any).mockResolvedValue([
        { player_id: 1, _count: { player_id: 5 } },
      ]);

      (prisma.players.findMany as any).mockResolvedValue([
        {
          player_id: 1,
          player_name: "Luis",
          player_lastname: "Diaz",
          team: { team_name: "Team B" },
        },
      ]);

      const result = await statisticsService.topScorersByTournament(1);

      expect(result[0].goals).toBe(5);
      expect(result[0].team).toBe("Team B");
    });
  });
});

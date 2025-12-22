import { describe, it, expect, vi, beforeEach } from "vitest";
import { matchPlayerService } from "@/modules/match-players/match-player.service";
import { matchPlayerRepository } from "@/modules/match-players/match-player.repository";
import prisma from "@/config/prisma";

vi.mock("@/modules/match-players/match-player.repository");
vi.mock("@/config/prisma", () => ({
  default: {
    $transaction: vi.fn((cb) => cb({})),
  },
}));

describe("MatchPlayerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("bulkCreate()", () => {
    it("borra planilla previa y crea jugadores", async () => {
      (matchPlayerRepository.deleteByMatch as any).mockResolvedValue({});
      (matchPlayerRepository.createMany as any).mockResolvedValue({});

      const result = await matchPlayerService.bulkCreate({
        matchId: 1,
        teamId: 2,
        players: [{ playerId: 10, isStarting: true }, { playerId: 11 }],
      });

      expect(matchPlayerRepository.deleteByMatch).toHaveBeenCalledWith(1, {});
      expect(matchPlayerRepository.createMany).toHaveBeenCalled();
      expect(result).toEqual({
        matchId: 1,
        totalPlayers: 2,
      });
    });
  });

  describe("listByMatch()", () => {
    it("retorna jugadores mapeados", async () => {
      (matchPlayerRepository.findByMatch as any).mockResolvedValue([
        {
          match_player_id: 1,
          is_starting: true,
          player: {
            player_id: 10,
            player_name: "Juan",
            player_lastname: "Pérez",
            player_number: 9,
          },
          team: {
            team_id: 2,
            team_name: "Borussia",
          },
        },
      ]);

      const result = await matchPlayerService.listByMatch(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        isStarting: true,
        player: {
          id: 10,
          name: "Juan Pérez",
          number: 9,
        },
        team: {
          id: 2,
          name: "Borussia",
        },
      });
    });
  });

  describe("deleteByMatch()", () => {
    it("retorna cantidad eliminada", async () => {
      (matchPlayerRepository.deleteByMatch as any).mockResolvedValue({
        count: 3,
      });

      const result = await matchPlayerService.deleteByMatch(1);

      expect(result.deletedCount).toBe(3);
    });
  });
});

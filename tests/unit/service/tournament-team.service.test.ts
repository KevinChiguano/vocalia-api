import { describe, it, expect, vi, beforeEach } from "vitest";
import { tournamentTeamService } from "@/modules/tournament-teams/tournament-team.service";
import { tournamentTeamRepository } from "@/modules/tournament-teams/tournament-team.repository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

vi.mock("@/modules/tournament-teams/tournament-team.repository");

describe("TournamentTeamService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create()", () => {
    it("crea equipo en torneo", async () => {
      (tournamentTeamRepository.create as any).mockResolvedValue({
        tournament_team_id: 1,
        tournament_id: 1,
        team: { team_id: 2, team_name: "Borussia" },
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_diff: 0,
        points: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await tournamentTeamService.create({
        tournamentId: 1,
        teamId: 2,
      });

      expect(result?.team?.name).toBe("Borussia");
      expect(result?.points).toBe(0);
    });

    it("lanza error si ya existe", async () => {
      (tournamentTeamRepository.create as any).mockRejectedValue(
        new PrismaClientKnownRequestError("Duplicate", {
          code: "P2002",
          clientVersion: "5",
        })
      );

      await expect(
        tournamentTeamService.create({ tournamentId: 1, teamId: 2 })
      ).rejects.toThrow("El equipo ya está inscrito en este torneo.");
    });
  });

  describe("update()", () => {
    it("actualiza datos", async () => {
      (tournamentTeamRepository.update as any).mockResolvedValue({
        tournament_team_id: 1,
        tournament_id: 1,
        team: null,
        played: 1,
        won: 1,
        drawn: 0,
        lost: 0,
        goals_for: 2,
        goals_against: 1,
        goal_diff: 1,
        points: 3,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await tournamentTeamService.update(1, {
        played: 1,
        won: 1,
        points: 3,
      });

      expect(result?.points).toBe(3);
    });

    it("lanza error si no hay datos", async () => {
      await expect(tournamentTeamService.update(1, {})).rejects.toThrow(
        "No hay datos válidos para actualizar."
      );
    });

    it("lanza error si no existe", async () => {
      (tournamentTeamRepository.update as any).mockRejectedValue(
        new PrismaClientKnownRequestError("Not found", {
          code: "P2025",
          clientVersion: "5",
        })
      );

      await expect(
        tournamentTeamService.update(99, { points: 1 })
      ).rejects.toThrow("El registro no existe.");
    });
  });

  describe("delete()", () => {
    it("elimina correctamente", async () => {
      (tournamentTeamRepository.delete as any).mockResolvedValue({});

      const result = await tournamentTeamService.delete(1);

      expect(result).toBe("Equipo eliminado del torneo.");
    });
  });

  describe("listByTournament()", () => {
    it("retorna equipos del torneo", async () => {
      (tournamentTeamRepository.findByTournament as any).mockResolvedValue([
        {
          tournament_team_id: 1,
          tournament_id: 1,
          team: { team_id: 1, team_name: "Ajax" },
          played: 1,
          won: 1,
          drawn: 0,
          lost: 0,
          goals_for: 2,
          goals_against: 0,
          goal_diff: 2,
          points: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await tournamentTeamService.listByTournament(1);

      expect(result).toHaveLength(1);
      expect(result[0]?.team?.name).toBe("Ajax");
    });
  });
});

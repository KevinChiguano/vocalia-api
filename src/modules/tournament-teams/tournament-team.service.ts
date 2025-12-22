import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type {
  CreateTournamentTeamInput,
  UpdateTournamentTeamInput,
} from "./tournament-team.schema";
import { tournamentTeamRepository } from "./tournament-team.repository";
import { convertToEcuadorTime } from "../../utils/convert.time";
import type { PrismaTx } from "../../config/prisma.types";

const mapTournamentTeamKeys = (tt: any) => {
  if (!tt) return null;

  return {
    id: tt.tournament_team_id,
    tournamentId: tt.tournament_id,
    team: tt.team
      ? {
          id: tt.team.team_id,
          name: tt.team.team_name,
        }
      : null,
    played: tt.played,
    won: tt.won,
    drawn: tt.drawn,
    lost: tt.lost,
    goalsFor: tt.goals_for,
    goalsAgainst: tt.goals_against,
    goalDiff: tt.goal_diff,
    points: tt.points,
    createdAt: convertToEcuadorTime(tt.created_at),
    updatedAt: convertToEcuadorTime(tt.updated_at),
  };
};

export class TournamentTeamService {
  async create(data: CreateTournamentTeamInput, tx?: PrismaTx) {
    try {
      const created = await tournamentTeamRepository.create(
        {
          tournament_id: BigInt(data.tournamentId),
          team_id: BigInt(data.teamId),
        },
        tx
      );

      return mapTournamentTeamKeys(created);
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("El equipo ya está inscrito en este torneo.");
      }
      throw e;
    }
  }

  async update(id: number, data: UpdateTournamentTeamInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.played !== undefined) updateData.played = data.played;
    if (data.won !== undefined) updateData.won = data.won;
    if (data.drawn !== undefined) updateData.drawn = data.drawn;
    if (data.lost !== undefined) updateData.lost = data.lost;
    if (data.goalsFor !== undefined) updateData.goals_for = data.goalsFor;
    if (data.goalsAgainst !== undefined)
      updateData.goals_against = data.goalsAgainst;
    if (data.points !== undefined) updateData.points = data.points;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updated = await tournamentTeamRepository.update(id, updateData, tx);
      return mapTournamentTeamKeys(updated);
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("El registro no existe.");
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await tournamentTeamRepository.delete(id, tx);
      return "Equipo eliminado del torneo.";
    } catch (e: any) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error("El registro no existe.");
      }
      throw e;
    }
  }

  async listByTournament(tournamentId: number, tx?: PrismaTx) {
    const items = await tournamentTeamRepository.findByTournament(
      tournamentId,
      tx
    );

    return items.map(mapTournamentTeamKeys);
  }
}

export const tournamentTeamService = new TournamentTeamService();

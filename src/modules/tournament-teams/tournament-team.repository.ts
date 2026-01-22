import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const tournamentTeamSelectFields = {
  tournament_team_id: true,
  tournament_id: true,
  team_id: true,
  played: true,
  won: true,
  drawn: true,
  lost: true,
  goals_for: true,
  goals_against: true,
  goal_diff: true,
  points: true,
  created_at: true,
  updated_at: true,
  team: {
    select: {
      team_id: true,
      team_name: true,
      team_logo: true,
    },
  },
  category_id: true,
  category: {
    select: {
      name: true,
    },
  },
};

export class TournamentTeamRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async create(
    data: Prisma.tournament_teamsUncheckedCreateInput,
    tx?: PrismaTx,
  ) {
    return this.getClient(tx).tournament_teams.create({
      data,
      select: tournamentTeamSelectFields,
    });
  }

  async findByTournament(tournamentId: number, tx?: PrismaTx) {
    return this.getClient(tx).tournament_teams.findMany({
      where: { tournament_id: BigInt(tournamentId) },
      select: tournamentTeamSelectFields,
      orderBy: [{ points: "desc" }, { goal_diff: "desc" }],
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    return this.getClient(tx).tournament_teams.findUnique({
      where: { tournament_team_id: BigInt(id) },
      select: tournamentTeamSelectFields,
    });
  }

  async update(
    id: number,
    data: Prisma.tournament_teamsUpdateInput,
    tx?: PrismaTx,
  ) {
    return this.getClient(tx).tournament_teams.update({
      where: { tournament_team_id: BigInt(id) },
      data,
      select: tournamentTeamSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).tournament_teams.delete({
      where: { tournament_team_id: BigInt(id) },
    });
  }
}

export const tournamentTeamRepository = new TournamentTeamRepository();

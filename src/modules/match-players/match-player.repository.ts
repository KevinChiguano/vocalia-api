// match-player.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const matchPlayerSelectFields = {
  match_player_id: true,
  is_starting: true,
  player: {
    select: {
      player_id: true,
      player_name: true,
      player_lastname: true,
      player_number: true,
    },
  },
  team: {
    select: {
      team_id: true,
      team_name: true,
    },
  },
};

export class MatchPlayerRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async create(data: Prisma.match_playersUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).match_players.create({
      data,
      select: matchPlayerSelectFields,
    });
  }

  async createMany(
    data: Prisma.match_playersUncheckedCreateInput[],
    tx?: PrismaTx
  ) {
    return this.getClient(tx).match_players.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findByMatch(matchId: number, tx?: PrismaTx) {
    return this.getClient(tx).match_players.findMany({
      where: { match_id: matchId },
      select: matchPlayerSelectFields,
    });
  }

  async deleteByMatch(matchId: number, tx?: PrismaTx) {
    return this.getClient(tx).match_players.deleteMany({
      where: { match_id: matchId },
    });
  }
}

export const matchPlayerRepository = new MatchPlayerRepository();

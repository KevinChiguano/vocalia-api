import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

type MatchId = number | bigint;

export const matchSelectFields = {
  match_id: true,
  match_date: true,
  stage: true,
  location: true,
  status: true,
  local_score: true,
  away_score: true,
  category: true,
  tournament_id: true,
  local_team_id: true,
  away_team_id: true,
  video_url: true,

  localTeam: {
    select: {
      team_id: true,
      team_name: true,
    },
  },
  awayTeam: {
    select: {
      team_id: true,
      team_name: true,
    },
  },
  tournament: {
    select: {
      tournament_id: true,
      name: true,
    },
  },
};

export class MatchRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.matchesFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.matches.findMany({
      ...params,
      select: params.select ?? matchSelectFields,
    });
  }

  async findById(id: MatchId, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.matches.findUnique({
      where: { match_id: BigInt(id) },
      select: matchSelectFields,
    });
  }

  async create(data: Prisma.matchesUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).matches.create({
      data,
      select: matchSelectFields,
    });
  }

  async update(id: MatchId, data: Prisma.matchesUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).matches.update({
      where: { match_id: BigInt(id) },
      data,
      select: matchSelectFields,
    });
  }

  async delete(id: MatchId, tx?: PrismaTx) {
    return this.getClient(tx).matches.delete({
      where: { match_id: BigInt(id) },
    });
  }

  async count(params: Prisma.matchesCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).matches.count(params);
  }
}

export const matchRepository = new MatchRepository();

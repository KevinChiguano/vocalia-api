// league.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const leagueSelectFields = {
  league_id: true,
  name: true,
  image_url: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

export class LeagueRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.leaguesFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.leagues.findMany({
      ...params,
      select: params.select ?? leagueSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.leagues.findUnique({
      where: { league_id: id },
      select: leagueSelectFields,
    });
  }

  async create(data: Prisma.leaguesUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).leagues.create({
      data,
      select: leagueSelectFields,
    });
  }

  async update(id: number, data: Prisma.leaguesUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).leagues.update({
      where: { league_id: id },
      data,
      select: leagueSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).leagues.delete({
      where: { league_id: id },
    });
  }

  async count(params: Prisma.leaguesCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).leagues.count(params);
  }
}

export const leagueRepository = new LeagueRepository();

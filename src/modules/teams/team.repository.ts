// team.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const teamSelectFields = {
  team_id: true,
  team_name: true,
  team_logo: true,
  is_active: true,
  created_at: true,
  category: {
    select: {
      name: true,
      category_id: true,
    },
  },
};

export class TeamRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.teamsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.teams.findMany({
      ...params,
      select: params.select ?? teamSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.teams.findUnique({
      where: { team_id: id },
      select: teamSelectFields,
    });
  }

  async create(data: Prisma.teamsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).teams.create({
      data,
      select: teamSelectFields,
    });
  }

  async update(id: number, data: Prisma.teamsUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).teams.update({
      where: { team_id: id },
      data,
      select: teamSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).teams.delete({
      where: { team_id: id },
    });
  }

  async count(params: Prisma.teamsCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).teams.count(params);
  }
}

export const teamRepository = new TeamRepository();

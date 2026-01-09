// goal.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const goalSelectFields = {
  goal_id: true,
  //match_id: true,
  //player_id: true,
  event_time: true,
  is_own_goal: true,
  player: {
    select: {
      player_id: true,
      player_name: true,
      player_lastname: true,
      player_number: true,
      player_dni: true,
    },
  },
  match: {
    select: {
      match_id: true,
      local_team_id: true,
      away_team_id: true,
      stage: true,
      status: true,
    },
  },
};

export class GoalRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.goalsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.goals.findMany({
      ...params,
      select: params.select ?? goalSelectFields,
    });
  }

  async findById(id: number | bigint, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.goals.findUnique({
      where: { goal_id: BigInt(id) },
      select: goalSelectFields,
    });
  }

  async create(data: Prisma.goalsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).goals.create({
      data,
      select: goalSelectFields,
    });
  }

  async createMany(data: Prisma.goalsCreateManyInput[], tx?: PrismaTx) {
    return this.getClient(tx).goals.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async update(
    id: number | bigint,
    data: Prisma.goalsUpdateInput,
    tx?: PrismaTx
  ) {
    return this.getClient(tx).goals.update({
      where: { goal_id: BigInt(id) },
      data,
      select: goalSelectFields,
    });
  }

  async delete(id: number | bigint, tx?: PrismaTx) {
    return this.getClient(tx).goals.delete({
      where: { goal_id: BigInt(id) },
    });
  }

  async count(params: Prisma.goalsCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).goals.count(params);
  }

  async deleteByMatchId(matchId: number | bigint, tx?: PrismaTx) {
    return this.getClient(tx).goals.deleteMany({
      where: { match_id: BigInt(matchId) },
    });
  }
}

export const goalRepository = new GoalRepository();

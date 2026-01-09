// substitution.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const substitutionSelectFields = {
  substitution_id: true,
  match_id: true,
  player_out: true,
  player_in: true,
  event_time: true,

  playerOut: {
    select: {
      player_id: true,
      player_name: true,
      player_lastname: true,
      player_number: true,
      player_dni: true,
    },
  },
  playerIn: {
    select: {
      player_id: true,
      player_name: true,
      player_lastname: true,
      player_number: true,
      player_dni: true,
    },
  },
};

export class SubstitutionRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.substitutionsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.substitutions.findMany({
      ...params,
      select: params.select ?? substitutionSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.substitutions.findUnique({
      where: { substitution_id: id },
      select: substitutionSelectFields,
    });
  }

  async create(data: Prisma.substitutionsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).substitutions.create({
      data,
      select: substitutionSelectFields,
    });
  }

  async createMany(data: Prisma.substitutionsCreateManyInput[], tx?: PrismaTx) {
    return this.getClient(tx).substitutions.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async update(
    id: number,
    data: Prisma.substitutionsUpdateInput,
    tx?: PrismaTx
  ) {
    return this.getClient(tx).substitutions.update({
      where: { substitution_id: id },
      data,
      select: substitutionSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).substitutions.delete({
      where: { substitution_id: id },
    });
  }

  async deleteByMatchId(matchId: number, tx?: PrismaTx) {
    return this.getClient(tx).substitutions.deleteMany({
      where: { match_id: matchId },
    });
  }

  async count(params: Prisma.substitutionsCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).substitutions.count(params);
  }
}

export const substitutionRepository = new SubstitutionRepository();

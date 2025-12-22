// sanction.repository.ts
import prisma from "../../config/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { PrismaTx } from "../../config/prisma.types";

export const sanctionSelectFields = {
  sanction_id: true,
  match_id: true,
  //player_id: true,
  type: true,
  description: true,
  event_time: true,
  player: {
    select: {
      player_id: true,
      player_name: true,
      player_lastname: true,
      player_number: true,
      player_dni: true,
    },
  },
};

export class SanctionRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.sanctionsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.sanctions.findMany({
      ...params,
      select: params.select ?? sanctionSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.sanctions.findUnique({
      where: { sanction_id: id },
      select: sanctionSelectFields,
    });
  }

  async create(data: Prisma.sanctionsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.create({
      data,
      select: sanctionSelectFields,
    });
  }

  async createMany(data: Prisma.sanctionsCreateManyInput[], tx?: PrismaTx) {
    return this.getClient(tx).sanctions.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async update(id: number, data: Prisma.sanctionsUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.update({
      where: { sanction_id: id },
      data,
      select: sanctionSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.delete({
      where: { sanction_id: id },
    });
  }

  async count(params: Prisma.sanctionsCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.count(params);
  }
}

export const sanctionRepository = new SanctionRepository();

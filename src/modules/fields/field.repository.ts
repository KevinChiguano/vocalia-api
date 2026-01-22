import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const fieldSelectFields = {
  field_id: true,
  name: true,
  location: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

export class FieldRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.fieldsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.fields.findMany({
      ...params,
      select: params.select ?? fieldSelectFields,
    });
  }

  async findById(id: number | bigint, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.fields.findUnique({
      where: { field_id: BigInt(id) },
      select: fieldSelectFields,
    });
  }

  async create(data: Prisma.fieldsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).fields.create({
      data,
      select: fieldSelectFields,
    });
  }

  async update(
    id: number | bigint,
    data: Prisma.fieldsUpdateInput,
    tx?: PrismaTx,
  ) {
    return this.getClient(tx).fields.update({
      where: { field_id: BigInt(id) },
      data,
      select: fieldSelectFields,
    });
  }

  async delete(id: number | bigint, tx?: PrismaTx) {
    return this.getClient(tx).fields.delete({
      where: { field_id: BigInt(id) },
    });
  }
}

export const fieldRepository = new FieldRepository();


import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const categorySelectFields = {
  category_id: true,
  name: true,
  description: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

export class CategoryRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.categoriesFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.categories.findMany({
      ...params,
      select: params.select ?? categorySelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.categories.findUnique({
      where: { category_id: id },
      select: categorySelectFields,
    });
  }

  async create(data: Prisma.categoriesCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).categories.create({
      data,
      select: categorySelectFields,
    });
  }

  async update(id: number, data: Prisma.categoriesUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).categories.update({
      where: { category_id: id },
      data,
      select: categorySelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).categories.delete({
      where: { category_id: id },
    });
  }

  async count(params: Prisma.categoriesCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).categories.count(params);
  }
}

export const categoryRepository = new CategoryRepository();

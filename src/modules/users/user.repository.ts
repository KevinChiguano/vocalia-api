// user.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const userSelectFields = {
  user_id: true,
  user_name: true,
  user_email: true,
  is_active: true, // Incluimos la relación 'roles' para que el service pueda mapearla
  roles: {
    select: {
      rol_id: true,
      rol_name: true,
    },
  },
};

export class UserRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findUniqueByEmail(email: string, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.users.findUnique({
      where: { user_email: email },
      select: userSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.users.findUnique({
      where: { user_id: id },
      select: userSelectFields,
    });
  }

  async findMany(params: Prisma.usersFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.users.findMany({
      ...params,
      select: params.select ?? userSelectFields,
    });
  }

  async create(data: Prisma.usersUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).users.create({
      data,
      select: userSelectFields,
    });
  }

  async update(id: number, data: Prisma.usersUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).users.update({
      where: { user_id: id },
      data,
      select: userSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).users.delete({
      where: { user_id: id },
    });
  }

  async count(params: Prisma.usersCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).users.count(params);
  }
}

export const userRepository = new UserRepository();

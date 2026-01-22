// player.repository.ts
import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const playerSelectFields = {
  player_id: true,
  player_name: true,
  player_lastname: true,
  player_number: true,
  player_dni: true,
  card_image_url: true,
  player_image_url: true,
  birth_date: true,
  team_id: true,
  team: {
    select: {
      team_id: true,
      team_name: true,
    },
  },
  category: {
    select: {
      category_id: true,
      name: true,
    },
  },
  is_active: true,
  created_at: true,
};

export class PlayerRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.playersFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.players.findMany({
      ...params,
      select: params.select ?? playerSelectFields,
    });
  } // Búsqueda por DNI (Identificador único clave)
  async findByDni(dni: string, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.players.findUnique({
      where: { player_dni: dni },
      select: playerSelectFields,
    });
  }

  async create(data: Prisma.playersUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).players.create({
      data,
      select: playerSelectFields,
    });
  }

  async createMany(data: Prisma.playersCreateManyInput[], tx?: PrismaTx) {
    return this.getClient(tx).players.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async update(dni: string, data: Prisma.playersUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).players.update({
      where: { player_dni: dni }, // Se actualiza por DNI
      data,
      select: playerSelectFields,
    });
  }

  async delete(dni: string, tx?: PrismaTx) {
    return this.getClient(tx).players.delete({
      where: { player_dni: dni }, // Se elimina por DNI
    });
  }

  async count(params: Prisma.playersCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).players.count(params);
  }
}

export const playerRepository = new PlayerRepository();

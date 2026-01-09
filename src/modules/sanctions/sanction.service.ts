// sanction.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { convertToEcuadorTime } from "@/utils/convert.time";
import { CreateSanctionInput, UpdateSanctionInput } from "./sanction.schema";
import { paginate } from "@/utils/pagination";
import {
  sanctionRepository,
  sanctionSelectFields,
} from "./sanction.repository";
import type { PrismaTx } from "@/config/prisma.types";
import { invalidateStatsByMatch } from "@/utils/cache.stats";

const mapSanctionKeys = (sanction: any) => {
  if (!sanction) return null;

  const player = sanction.player
    ? {
        id: sanction.player.player_id,
        name: sanction.player.player_name,
        lastName: sanction.player.player_lastname,
        number: sanction.player.player_number,
        dni: sanction.player.player_dni,
      }
    : undefined;

  return {
    id: sanction.sanction_id,
    matchId: sanction.match_id,
    //playerId: sanction.player_id,
    type: sanction.type,
    description: sanction.description,
    eventTime: convertToEcuadorTime(sanction.event_time),
    player: player,
  };
};

export class SanctionService {
  async create(data: CreateSanctionInput, tx?: PrismaTx) {
    const newSanction = await sanctionRepository.create(
      // Uso del Repository
      {
        match_id: data.matchId,
        player_id: data.playerId,
        type: data.type as any,
        description: data.description,
        event_time: new Date(data.eventTime),
      },
      tx
    );

    if (!tx) {
      await invalidateStatsByMatch(data.matchId);
    }

    return mapSanctionKeys(newSanction);
  }

  async createBulk(data: CreateSanctionInput[], tx?: PrismaTx) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("El arreglo de sanciones está vacío.");
    }

    const sanctionsToInsert = data.map((sanction) => ({
      match_id: sanction.matchId,
      player_id: sanction.playerId,
      type: sanction.type as any,
      description: sanction.description,
      event_time: new Date(sanction.eventTime),
    }));

    const result = await sanctionRepository.createMany(sanctionsToInsert, tx); // Uso del Repository

    if (!tx) {
      await invalidateStatsByMatch(data[0].matchId);
    }

    return {
      count: result.count,
      message: `Se insertaron ${result.count} sanciones de forma masiva.`,
    };
  }

  async update(id: number, data: UpdateSanctionInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.matchId !== undefined) updateData.match_id = data.matchId;
    if (data.playerId !== undefined) updateData.player_id = data.playerId;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.eventTime) updateData.event_time = new Date(data.eventTime);

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar la sanción.");
    }

    try {
      const updatedSanction = await sanctionRepository.update(
        // Uso del Repository
        id,
        updateData,
        tx
      );
      return mapSanctionKeys(updatedSanction);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`La sanción con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await sanctionRepository.delete(id, tx); // Uso del Repository
      return "Sanción eliminada";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `La sanción con ID ${id} no fue encontrada para borrar.`
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const sanction = await sanctionRepository.findById(id, tx); // Uso del Repository
    return mapSanctionKeys(sanction);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where: any = {};

    if (filter.matchId !== undefined) {
      where.match_id = filter.matchId;
    }

    if (filter.playerId !== undefined) {
      where.player_id = filter.playerId;
    }

    if (filter.type !== undefined) {
      where.type = filter.type;
    }

    const result = await paginate(
      sanctionRepository, // Pasamos el Repository al paginador
      { page, limit },
      {
        where,
        select: sanctionSelectFields,
        orderBy: { sanction_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapSanctionKeys),
      pagination: result.pagination,
    };
  }
}

export const sanctionService = new SanctionService();

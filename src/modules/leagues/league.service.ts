// league.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type {
  CreateLeagueInput,
  UpdateLeagueInput,
} from "./league.schema";
import {
  leagueRepository,
  leagueSelectFields,
} from "./league.repository";

import {
  convertToEcuadorTime,
} from "@/utils/convert.time";

import { paginate } from "@/utils/pagination";
import type { PrismaTx } from "@/config/prisma.types";

import {
  buildSearchFilter,
  buildBooleanFilter,
} from "@/utils/filter.builder";

const mapLeagueKeys = (league: any) => {
  if (!league) return null;

  return {
    id: league.league_id,
    name: league.name,
    imageUrl: league.image_url,
    isActive: league.is_active,
    createdAt: convertToEcuadorTime(league.created_at),
    updatedAt: league.updated_at ? convertToEcuadorTime(league.updated_at) : null,
  };
};

export class LeagueService {
  async create(data: CreateLeagueInput, tx?: PrismaTx) {
    const { name, isActive } = data;

    const newLeague = await leagueRepository.create(
      {
        name,
        image_url: data.imageUrl,
        is_active: isActive ?? true,
      },
      tx
    );

    return mapLeagueKeys(newLeague);
  }

  async update(id: number, data: UpdateLeagueInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (typeof data.isActive === "boolean")
      updateData.is_active = data.isActive;
    
    // Actualizar updated_at cuando se modifica
    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updatedLeague = await leagueRepository.update(
        id,
        updateData,
        tx
      );
      return mapLeagueKeys(updatedLeague);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`La liga con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await leagueRepository.delete(id, tx);
      return "Liga eliminada";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `La liga con ID ${id} no fue encontrada para borrar.`
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const league = await leagueRepository.findById(id, tx);

    return mapLeagueKeys(league);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where: any = {};

    Object.assign(
      where,
      buildBooleanFilter("is_active", filter.is_active),
      buildSearchFilter(filter.search, ["name"])
    );

    const result = await paginate(
      leagueRepository,
      { page, limit },
      {
        where,
        select: leagueSelectFields,
        orderBy: { league_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapLeagueKeys),
      pagination: result.pagination,
    };
  }
}

export const leagueService = new LeagueService();

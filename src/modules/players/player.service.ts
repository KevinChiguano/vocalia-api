// player.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { convertToEcuadorTime } from "@/utils/convert.time";
import type { CreatePlayerInput, UpdatePlayerInput } from "./player.schema";
import { paginate } from "@/utils/pagination";
import { playerRepository, playerSelectFields } from "./player.repository"; // Importación clave
import type { PrismaTx } from "@/config/prisma.types";
import {
  buildSearchFilter,
  buildBooleanFilter,
} from "@/utils/filter.builder";

const mapPlayerKeys = (player: any) => {
  if (!player) return null;
  return {
    id: player.player_id,
    name: player.player_name,
    lastname: player.player_lastname,
    number: player.player_number,
    dni: player.player_dni,
    cardUrl: player.card_image_url,
    birthDate: player.birth_date ? player.birth_date.toISOString().split('T')[0] : null,
    team: player.team
      ? {
          id: player.team.team_id,
          name: player.team.team_name,
        }
      : null,
    category: player.category
      ? {
          id: player.category.category_id,
          name: player.category.name,
        }
      : null,
    isActive: player.is_active,
    createAt: convertToEcuadorTime(player.created_at),
  };
};

export class PlayerService {
  async create(data: CreatePlayerInput, tx?: PrismaTx) {
    const newPlayer = await playerRepository.create(
      // Uso del Repository
      {
        player_name: data.name,
        player_lastname: data.lastname,
        player_number: data.number,
        player_dni: data.dni,
        card_image_url: data.cardUrl,
        birth_date: data.birthDate ? new Date(data.birthDate) : undefined,
        team_id: data.teamId,
        category_id: data.categoryId,
        is_active: data.isActive ?? true,
      },
      tx
    );

    return mapPlayerKeys(newPlayer);
  }

  async update(dni: string, data: UpdatePlayerInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.name) updateData.player_name = data.name;
    if (data.lastname) updateData.player_lastname = data.lastname;
    if (data.number) updateData.player_number = data.number;
    if (data.dni) updateData.player_dni = data.dni;
    if (data.cardUrl) updateData.card_image_url = data.cardUrl;
    if (data.birthDate) updateData.birth_date = new Date(data.birthDate);
    if (data.teamId) updateData.team_id = data.teamId;
    if (data.categoryId) updateData.category_id = data.categoryId;
    if (typeof data.isActive === "boolean")
      updateData.is_active = data.isActive;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updatedPlayer = await playerRepository.update(
        // Uso del Repository
        dni,
        updateData,
        tx
      );
      return mapPlayerKeys(updatedPlayer);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`El jugador con dni ${dni} no existe.`);
      }
      throw e;
    }
  }

  async delete(dni: string, tx?: PrismaTx) {
    try {
      await playerRepository.delete(dni, tx); // Uso del Repository
      return "Jugador eliminado";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `El jugador con dni ${dni} no fue encontrado para borrar.`
        );
      }
      throw e;
    }
  }

  async getByDni(dni: string, tx?: PrismaTx) {
    const player = await playerRepository.findByDni(dni, tx); // Uso del Repository

    return mapPlayerKeys(player);
  }

  async list(page: number, limit: number, filter: any = {}, tx?: PrismaTx) {
    const where: any = {};

    if (filter.teamId !== undefined) {
      where.team_id = filter.teamId;
    }

    Object.assign(
      where,
      buildBooleanFilter("is_active", filter.is_active),
      buildSearchFilter(filter.search, ["player_name", "player_lastname", "player_dni"])
    );

    const result = await paginate(
      playerRepository, // Pasamos el Repository al paginador
      { page, limit },
      {
        where,
        select: playerSelectFields,
        orderBy: { player_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapPlayerKeys),
      pagination: result.pagination,
    };
  }
}

export const playerService = new PlayerService();

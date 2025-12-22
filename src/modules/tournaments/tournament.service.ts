// tournament.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type {
  CreateTournamentInput,
  UpdateTournamentInput,
} from "./tournament.schema";
import {
  tournamentRepository,
  tournamentSelectFields,
} from "./tournament.repository"; // Importación clave

import {
  convertToEcuadorTime,
  formatDateToISO,
} from "../../utils/convert.time";

import { paginate } from "../../utils/pagination";
import type { PrismaTx } from "../../config/prisma.types";

const mapTournamentKeys = (tournament: any) => {
  if (!tournament) return null;

  return {
    id: tournament.tournament_id,
    name: tournament.name,
    startDate: formatDateToISO(tournament.start_date),
    endDate: formatDateToISO(tournament.end_date),
    isActive: tournament.is_active,
    createdAt: convertToEcuadorTime(tournament.created_at),
  };
};

export class TournamentService {
  async create(data: CreateTournamentInput, tx?: PrismaTx) {
    const { name, startDate, endDate, isActive } = data;

    const startDateObject = startDate ? new Date(startDate) : undefined;
    const endDateObject = endDate ? new Date(endDate) : undefined;

    const newTournament = await tournamentRepository.create(
      // Uso del Repository
      {
        name,
        start_date: startDateObject,
        end_date: endDateObject,
        is_active: isActive ?? true,
      },
      tx
    );

    return mapTournamentKeys(newTournament);
  }

  async update(id: number, data: UpdateTournamentInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.startDate) updateData.start_date = new Date(data.startDate);
    if (data.endDate) updateData.end_date = new Date(data.endDate);
    if (typeof data.isActive === "boolean")
      updateData.is_active = data.isActive;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updatedTournament = await tournamentRepository.update(
        // Uso del Repository
        id,
        updateData,
        tx
      );
      return mapTournamentKeys(updatedTournament);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`El torneo con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await tournamentRepository.delete(id, tx); // Uso del Repository
      return "Torneo eliminado";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `El torneo con ID ${id} no fue encontrado para borrar.`
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const tournament = await tournamentRepository.findById(id, tx); // Uso del Repository

    return mapTournamentKeys(tournament);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where = filter;

    const result = await paginate(
      tournamentRepository, // Pasamos el Repository al paginador
      { page, limit },
      {
        where,
        select: tournamentSelectFields,
        orderBy: { tournament_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapTournamentKeys),
      pagination: result.pagination,
    };
  }
}

export const tournamentService = new TournamentService();

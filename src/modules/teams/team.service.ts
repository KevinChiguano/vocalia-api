// team.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { convertToEcuadorTime } from "../../utils/convert.time";
import { CreateTeamInput, UpdateTeamInput } from "./team.schema";
import { paginate } from "../../utils/pagination";
import { teamRepository, teamSelectFields } from "./team.repository"; // Importación clave
import type { PrismaTx } from "../../config/prisma.types";

const mapTeamKeys = (team: any) => {
  if (!team) return null;

  return {
    id: team.team_id,
    name: team.team_name,
    logo: team.team_logo,
    category: team.team_category,
    isActive: team.is_active,
    createdAt: convertToEcuadorTime(team.created_at),
  };
};

export class TeamService {
  async create(data: CreateTeamInput, tx?: PrismaTx) {
    const newTeam = await teamRepository.create(
      // Uso del Repository
      {
        team_name: data.name,
        team_logo: data.logo,
        team_category: data.category,
        is_active: data.isActive ?? true,
      },
      tx
    );

    return mapTeamKeys(newTeam);
  }

  async update(id: number, data: UpdateTeamInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.name) updateData.team_name = data.name;
    if (data.logo) updateData.team_logo = data.logo;
    if (data.category) updateData.team_category = data.category;
    if (typeof data.isActive === "boolean")
      updateData.is_active = data.isActive;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updatedTeam = await teamRepository.update(id, updateData, tx); // Uso del Repository
      return mapTeamKeys(updatedTeam);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`El equipo con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await teamRepository.delete(id, tx); // Uso del Repository
      return "Equipo eliminado";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `El equipo con ID ${id} no fue encontrado para borrar.`
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const team = await teamRepository.findById(id, tx); // Uso del Repository
    return mapTeamKeys(team);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where = filter;
    const result = await paginate(
      teamRepository, // Pasamos el Repository al paginador
      { page, limit },
      {
        where,
        select: teamSelectFields,
        orderBy: { team_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapTeamKeys),
      pagination: result.pagination,
    };
  }
}

export const teamService = new TeamService();

// match.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateMatchInput, UpdateMatchInput } from "./match.schema";
import { paginate } from "@/utils/pagination";
import { matchRepository, matchSelectFields } from "./match.repository"; // Importación clave
import type { PrismaTx } from "@/config/prisma.types";
import prisma from "@/config/prisma";
import { convertToEcuadorTime } from "@/utils/convert.time";
import {
  buildSearchFilter,
  buildDateRangeFilter,
} from "@/utils/filter.builder";

const mapMatchKeys = (match: any) => {
  if (!match) return null;
  return {
    id: match.match_id,
    date: match.match_date,
    stage: match.stage,
    // location: match.location,
    status: match.status,
    localScore: match.local_score,
    awayScore: match.away_score,
    videoUrl: match.video_url,
    category: match.category,

    localTeam: match.localTeam
      ? {
          id: match.localTeam.team_id,
          name: match.localTeam.team_name,
        }
      : null,

    awayTeam: match.awayTeam
      ? {
          id: match.awayTeam.team_id,
          name: match.awayTeam.team_name,
        }
      : null,

    tournament: match.tournament
      ? {
          id: match.tournament.tournament_id,
          name: match.tournament.name,
        }
      : null,

    field: match.field
      ? {
          id: match.field.field_id,
          name: match.field.name,
          location: match.field.location,
        }
      : null,

    vocal: match.vocalias?.[0]?.vocalUser
      ? {
          id: match.vocalias[0].vocalUser.user_id,
          name: match.vocalias[0].vocalUser.user_name,
        }
      : null,
  };
};

export class MatchService {
  async create(data: CreateMatchInput) {
    return prisma.$transaction(async (tx) => {
      const newMatch = await matchRepository.create(
        {
          tournament_id: data.tournamentId,
          local_team_id: data.localTeamId,
          away_team_id: data.awayTeamId,
          stage: data.stage,
          category: data.category,
          match_day: data.matchDay,
          match_date: data.matchDate,
          field_id: data.fieldId,
          status: data.status ?? "programado",
          local_score: 0,
          away_score: 0,
        },
        tx,
      );

      if (data.vocalUserId !== undefined) {
        await tx.vocalias.create({
          data: {
            match_id: newMatch.match_id,
            vocal_user_id: BigInt(data.vocalUserId),
            vocalia_data: {},
          },
        });
      }

      // Re-fetch match with details
      const matchWithDetails = await matchRepository.findById(
        newMatch.match_id,
        tx,
      );
      return mapMatchKeys(matchWithDetails || newMatch);
    });
  }

  async update(id: number, data: UpdateMatchInput, tx?: PrismaTx) {
    // Preparamos el objeto de datos para la actualización, omitiendo los campos undefined
    const updateData: any = {};
    if (data.tournamentId !== undefined)
      updateData.tournament_id = data.tournamentId;
    if (data.localTeamId !== undefined)
      updateData.local_team_id = data.localTeamId;
    if (data.awayTeamId !== undefined)
      updateData.away_team_id = data.awayTeamId;
    if (data.stage !== undefined) updateData.stage = data.stage;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.matchDay !== undefined) updateData.match_day = data.matchDay;
    if (data.matchDate !== undefined) updateData.match_date = data.matchDate;
    if (data.fieldId !== undefined) updateData.field_id = data.fieldId;
    // if (data.location !== undefined) updateData.location = data.location;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.localScore !== undefined) updateData.local_score = data.localScore;
    if (data.awayScore !== undefined) updateData.away_score = data.awayScore;

    try {
      const updatedMatch = await prisma.$transaction(async (tx) => {
        const match = await matchRepository.update(id, updateData, tx);

        if (data.vocalUserId !== undefined) {
          // Update or Create vocalia
          await tx.vocalias.upsert({
            where: { match_id: BigInt(id) },
            update: { vocal_user_id: BigInt(data.vocalUserId) },
            create: {
              match_id: BigInt(id),
              vocal_user_id: BigInt(data.vocalUserId),
              vocalia_data: {},
            },
          });
        }

        return match;
      });
      return mapMatchKeys(updatedMatch);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`El partido con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      await matchRepository.delete(id, tx); // Uso del Repository
      return "Partido eliminado exitosamente.";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `El partido con ID ${id} no fue encontrado para eliminar.`,
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const match = await matchRepository.findById(id, tx); // Uso del Repository
    return mapMatchKeys(match);
  }
  /**
   * Obtiene la lista de partidos paginada.
   * @param page Número de página.
   * @param limit Límite de ítems por página.
   * @param filter Filtros para la consulta 'where'.
   */

  async list(page: number, limit: number, filter: any = {}, tx?: PrismaTx) {
    const where: any = {};

    if (filter.tournamentId !== undefined) {
      where.tournament_id = filter.tournamentId;
    }

    if (filter.matchDay !== undefined) {
      where.match_day = filter.matchDay;
    }

    if (filter.status !== undefined) {
      if (Array.isArray(filter.status)) {
        where.status = { in: filter.status };
      } else {
        where.status = filter.status;
      }
    }

    Object.assign(
      where,
      buildSearchFilter(filter.stage, ["stage"]),
      buildDateRangeFilter(
        "match_date",
        filter.matchDateFrom,
        filter.matchDateTo,
      ),
    );

    const result = await paginate(
      matchRepository,
      { page, limit },
      {
        where,
        select: matchSelectFields,
        orderBy: { match_id: "desc" },
      },
      tx,
    );

    return {
      items: result.items.map(mapMatchKeys),
      pagination: result.pagination,
    };
  }
}

export const matchService = new MatchService();

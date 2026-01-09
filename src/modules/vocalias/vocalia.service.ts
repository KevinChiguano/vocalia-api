import type { CreateVocaliaInput, UpdateVocaliaInput } from "./vocalia.schema";
import { paginate } from "@/utils/pagination";
import { vocaliaRepository, vocaliaSelectFields } from "./vocalia.repository";
import { convertToEcuadorTime } from "@/utils/convert.time";
import type { PrismaTx } from "@/config/prisma.types";
import prisma from "@/config/prisma";
import { invalidateTournamentStats } from "@/utils/cache.stats";

const mapVocaliaKeys = (v: any) => {
  if (!v) return null;

  return {
    id: Number(v.vocalia_id),
    matchId: Number(v.match_id),
    vocalUserId: Number(v.vocal_user_id),
    localCaptainId: v.local_captain_id ? Number(v.local_captain_id) : null,
    awayCaptainId: v.away_captain_id ? Number(v.away_captain_id) : null,
    observations: v.observations,
    vocaliaData: v.vocalia_data,
    createdAt: convertToEcuadorTime(v.created_at),
    match: v.match,
  };
};

export class VocaliaService {
  async create(data: CreateVocaliaInput, tx?: PrismaTx) {
    const exists = await vocaliaRepository.findByMatchId(data.matchId, tx);
    if (exists) throw new Error("Este partido ya tiene vocal asignado.");

    const vocalia = await vocaliaRepository.create(
      {
        match_id: BigInt(data.matchId),
        vocal_user_id: BigInt(data.vocalUserId),
        vocalia_data: {},
      },
      tx
    );

    return mapVocaliaKeys(vocalia);
  }

  async update(matchId: number, data: UpdateVocaliaInput, vocalUserId: number) {
    const vocalia = await vocaliaRepository.findByMatchAndVocal(
      matchId,
      vocalUserId
    );

    if (!vocalia)
      throw new Error("No tiene permisos para modificar esta vocalía.");

    const updateData: any = {};

    if (data.localCaptainId !== undefined)
      updateData.local_captain_id = data.localCaptainId;
    if (data.awayCaptainId !== undefined)
      updateData.away_captain_id = data.awayCaptainId;
    if (data.observations !== undefined)
      updateData.observations = data.observations;
    if (data.vocaliaData !== undefined)
      updateData.vocalia_data = data.vocaliaData;

    const updated = await vocaliaRepository.update(matchId, updateData);
    return mapVocaliaKeys(updated);
  }

  async finalize(
    matchId: number,
    data: { localScore: number; awayScore: number }
  ) {
    const finalLocalScore = data.localScore;
    const finalAwayScore = data.awayScore;

    // 1️⃣ Validaciones básicas
    if (finalLocalScore < 0 || finalAwayScore < 0) {
      throw new Error("El marcador no puede ser negativo.");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 2️⃣ Obtener vocalía + partido
      const vocalia = await tx.vocalias.findUnique({
        where: { match_id: BigInt(matchId) },
        include: { match: true },
      });

      if (!vocalia) {
        throw new Error("No existe vocalía.");
      }

      const match = vocalia.match;

      if (!match) {
        throw new Error("El partido no existe.");
      }

      // 3️⃣ Evitar doble finalización (idempotencia)
      if (match.status === "finalizado") {
        throw new Error("El partido ya fue finalizado.");
      }

      const { tournament_id, local_team_id, away_team_id } = match;

      // 4️⃣ Finalizar partido
      await tx.matches.update({
        where: { match_id: BigInt(matchId) },
        data: {
          local_score: finalLocalScore,
          away_score: finalAwayScore,
          status: "finalizado",
        },
      });

      // 5️⃣ Obtener registros de tabla de posiciones
      const [localTT, awayTT] = await Promise.all([
        tx.tournament_teams.findUnique({
          where: {
            uq_tournament_team: {
              tournament_id,
              team_id: local_team_id,
            },
          },
        }),
        tx.tournament_teams.findUnique({
          where: {
            uq_tournament_team: {
              tournament_id,
              team_id: away_team_id,
            },
          },
        }),
      ]);

      if (!localTT || !awayTT) {
        throw new Error("Los equipos no están registrados en el torneo.");
      }

      // 6️⃣ Calcular resultado
      const result = {
        localPoints: 0,
        awayPoints: 0,
        localWon: 0,
        localDraw: 0,
        localLost: 0,
        awayWon: 0,
        awayDraw: 0,
        awayLost: 0,
      };

      if (finalLocalScore > finalAwayScore) {
        result.localPoints = 3;
        result.localWon = 1;
        result.awayLost = 1;
      } else if (finalLocalScore < finalAwayScore) {
        result.awayPoints = 3;
        result.awayWon = 1;
        result.localLost = 1;
      } else {
        result.localPoints = 1;
        result.awayPoints = 1;
        result.localDraw = 1;
        result.awayDraw = 1;
      }

      // 7️⃣ Actualizar tabla de posiciones
      await Promise.all([
        tx.tournament_teams.update({
          where: { tournament_team_id: localTT.tournament_team_id },
          data: {
            played: { increment: 1 },
            won: { increment: result.localWon },
            drawn: { increment: result.localDraw },
            lost: { increment: result.localLost },
            goals_for: { increment: finalLocalScore },
            goals_against: { increment: finalAwayScore },
            goal_diff: { increment: finalLocalScore - finalAwayScore },
            points: { increment: result.localPoints },
            updated_at: new Date(),
          },
        }),
        tx.tournament_teams.update({
          where: { tournament_team_id: awayTT.tournament_team_id },
          data: {
            played: { increment: 1 },
            won: { increment: result.awayWon },
            drawn: { increment: result.awayDraw },
            lost: { increment: result.awayLost },
            goals_for: { increment: finalAwayScore },
            goals_against: { increment: finalLocalScore },
            goal_diff: { increment: finalAwayScore - finalLocalScore },
            points: { increment: result.awayPoints },
            updated_at: new Date(),
          },
        }),
      ]);

      // 8️⃣ Respuesta final
      return {
        matchId,
        tournamentId: Number(tournament_id),
        status: "finalizado",
        score: {
          local: finalLocalScore,
          away: finalAwayScore,
        },
      };
    });
    await invalidateTournamentStats(result.tournamentId);

    return result;
  }

  async getByMatchId(matchId: number) {
    const vocalia = await vocaliaRepository.findByMatchId(matchId);
    if (!vocalia) throw new Error("No existe vocalía para este partido.");

    return mapVocaliaKeys(vocalia);
  }

  async listByVocal(vocalUserId: number, page: number, limit: number) {
    const result = await paginate(
      vocaliaRepository,
      { page, limit },
      {
        where: { vocal_user_id: BigInt(vocalUserId) },
        orderBy: { created_at: "desc" },
        select: vocaliaSelectFields,
      }
    );

    return {
      items: result.items.map(mapVocaliaKeys),
      pagination: result.pagination,
    };
  }
}

export const vocaliaService = new VocaliaService();

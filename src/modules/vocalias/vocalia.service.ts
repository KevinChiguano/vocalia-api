import type { CreateVocaliaInput, UpdateVocaliaInput } from "./vocalia.schema";
import { paginate } from "@/utils/pagination";
import * as argon2 from "argon2";
import { vocaliaRepository, vocaliaSelectFields } from "./vocalia.repository";
import { convertToEcuadorTime } from "@/utils/convert.time";
import type { PrismaTx } from "@/config/prisma.types";
import prisma from "@/config/prisma";
import { invalidateTournamentStats } from "@/utils/cache.stats";

const mapMatch = (m: any) => {
  if (!m) return null;
  return {
    ...m,
    id: m.match_id ? Number(m.match_id) : undefined,
    date: m.match_date ? new Date(m.match_date) : null,
    localTeam: m.localTeam
      ? {
          ...m.localTeam,
          id: m.localTeam.team_id ? Number(m.localTeam.team_id) : undefined,
          name: m.localTeam.team_name,
        }
      : null,
    awayTeam: m.awayTeam
      ? {
          ...m.awayTeam,
          id: m.awayTeam.team_id ? Number(m.awayTeam.team_id) : undefined,
          name: m.awayTeam.team_name,
        }
      : null,
    field: m.field
      ? {
          ...m.field,
          id: m.field.field_id ? Number(m.field.field_id) : undefined,
        }
      : null,
  };
};

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
    vocalUser: v.vocalUser
      ? {
          name: v.vocalUser.user_name,
          email: v.vocalUser.user_email,
        }
      : null,
    match: mapMatch(v.match),
    signatures: v.signatures,
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
      tx,
    );

    return mapVocaliaKeys(vocalia);
  }

  async update(matchId: number, data: UpdateVocaliaInput, vocalUserId: number) {
    const vocalia = await vocaliaRepository.findByMatchAndVocal(
      matchId,
      vocalUserId,
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
    data: {
      localScore: number;
      awayScore: number;
      vocaliaData?: any;
      arbitratorName?: string;
      signatures?: any;
    },
  ) {
    const finalLocalScore = data.localScore;
    const finalAwayScore = data.awayScore;

    // 1️⃣ Validaciones básicas
    if (finalLocalScore < 0 || finalAwayScore < 0) {
      throw new Error("El marcador no puede ser negativo.");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 2️⃣ Obtener partido directamente
      const match = await tx.matches.findUnique({
        where: { match_id: BigInt(matchId) },
        include: {
          localTeam: true,
          awayTeam: true,
        },
      });

      if (!match) {
        throw new Error("El partido no existe.");
      }

      // 3️⃣ Evitar doble finalización (idempotencia)
      if (match.status === "finalizado") {
        throw new Error("El partido ya fue finalizado.");
      }

      const { tournament_id, local_team_id, away_team_id } = match;

      // 3.5 Actualizar vocaliaData (montos recolectados) si existe vocalía
      if (data.vocaliaData || data.arbitratorName || data.signatures) {
        // Intentamos actualizar la vocalía si existe
        await tx.vocalias.updateMany({
          where: { match_id: BigInt(matchId) },
          data: {
            vocalia_data: data.vocaliaData,
            arbitrator_name: data.arbitratorName,
            signatures: data.signatures,
          },
        });
      }

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
    if (!vocalia) {
      // If no vocalia exists, check if we can return just the match structure (handled by controller for Admin)
      // But the controller calls this.
      // Let's throw specific error so controller can catch and try backup
      throw new Error("No existe vocalía para este partido.");
    }

    return mapVocaliaKeys(vocalia);
  }

  // Nuevo método para Admins: obtener partido simulando estructura de vocalía
  async getMatchAsVocalia(matchId: number) {
    const match = await prisma.matches.findUnique({
      where: { match_id: BigInt(matchId) },
      include: {
        localTeam: true,
        awayTeam: true,
        field: true,
        tournament: true,
      },
    });

    if (!match) throw new Error("Partido no encontrado");

    // Retornar estructura compatible ("Virtual Vocalia")
    return {
      id: 0,
      matchId: Number(match.match_id),
      vocalUserId: 0,
      localCaptainId: null,
      awayCaptainId: null,
      observations: null,
      vocaliaData: {},
      createdAt: new Date(),
      match: mapMatch(match), // El frontend usará match.localTeam, match.match_date, etc.
    };
  }

  async listByVocal(vocalUserId: number, page: number, limit: number) {
    const result = await paginate(
      vocaliaRepository,
      { page, limit },
      {
        where: { vocal_user_id: BigInt(vocalUserId) },
        orderBy: { created_at: "desc" },
        select: vocaliaSelectFields,
      },
    );

    return {
      items: result.items.map(mapVocaliaKeys),
      pagination: result.pagination,
    };
  }

  async getFinancials(filters: any) {
    const whereClause: any = {};

    if (
      filters.tournamentId ||
      filters.categoryId ||
      filters.startDate ||
      filters.endDate ||
      filters.search
    ) {
      whereClause.match = {};

      if (filters.tournamentId) {
        whereClause.match.tournament_id = BigInt(filters.tournamentId);
      }

      if (filters.categoryId) {
        whereClause.match.category = filters.categoryId;
      }

      if (filters.startDate && filters.endDate) {
        const start = new Date(`${filters.startDate}T00:00:00.000Z`);
        const end = new Date(`${filters.endDate}T23:59:59.999Z`);
        whereClause.match.match_date = {
          gte: start,
          lte: end,
        };
      }

      if (filters.search) {
        const searchStr = filters.search.trim();
        const searchAsNumber = parseInt(searchStr, 10);

        whereClause.match.OR = [
          {
            localTeam: {
              team_name: { contains: searchStr, mode: "insensitive" },
            },
          },
          {
            awayTeam: {
              team_name: { contains: searchStr, mode: "insensitive" },
            },
          },
        ];

        if (!isNaN(searchAsNumber)) {
          whereClause.match.OR.push({ match_id: BigInt(searchAsNumber) });
        }
      }
    }

    const result = await paginate(
      vocaliaRepository,
      { page: filters.page, limit: filters.limit },
      {
        where: whereClause,
        orderBy: { created_at: "desc" },
        select: vocaliaSelectFields,
      },
    );

    const items = result.items.map(mapVocaliaKeys);

    let totalRevenue = 0;
    let pendingPayments = 0;
    let collectedToday = 0;
    let outstandingDebtsAmount = 0;

    const today = new Date().toDateString();

    const transactions = items.map((v: any) => {
      const localP = parseFloat(v.vocaliaData?.localAmount || "0");
      const awayP = parseFloat(v.vocaliaData?.awayAmount || "0");
      const totalMatchRevenue = localP + awayP;

      let status = "pending";

      if (v.match?.status === "finalizado") {
        status = "paid";
        if (totalMatchRevenue > 0 && (localP === 0 || awayP === 0)) {
          status = "partial";
        }
      } else {
        status = "pending";
      }

      totalRevenue += totalMatchRevenue;

      // Unicamente los NO finalizados se consideran "partidos pendientes"
      if (v.match?.status !== "finalizado") {
        pendingPayments++;
        // Asumimos un costo base (ej. $50.6) que aún falta por cobrar si está pendiente
        outstandingDebtsAmount += 50.6;
      }

      if (v.createdAt && new Date(v.createdAt).toDateString() === today) {
        collectedToday += totalMatchRevenue;
      }

      return {
        id: v.matchId,
        matchId: `M-${v.matchId}`,
        teams: {
          local: v.match?.localTeam?.name || "Local",
          away: v.match?.awayTeam?.name || "Away",
        },
        category: v.match?.category || "General",
        date: v.match?.date,
        paymentTeamA: localP,
        paymentTeamB: awayP,
        totalMatchRevenue,
        status,
      };
    });

    return {
      summary: {
        totalRevenue,
        pendingPayments,
        collectedToday,
        outstandingDebtsAmount,
      },
      transactions,
      pagination: result.pagination,
    };
  }

  async listAll(page: number, limit: number) {
    const result = await paginate(
      vocaliaRepository,
      { page, limit },
      {
        orderBy: { created_at: "desc" },
        select: vocaliaSelectFields,
      },
    );

    return {
      items: result.items.map(mapVocaliaKeys),
      pagination: result.pagination,
    };
  }

  async verifyAccess(
    matchId: number,
    passwordAttempt: string,
    currentUser: any,
  ) {
    // 1. Check if user is Admin and password matches THEIR password
    if (currentUser.rol === "ADMIN") {
      // We need to fetch the admin's actual password from DB to compare
      // Assuming currentUser from token might not have the password hash or we shouldn't trust it blindly if we want strict check
      // But usually verifyAccess implies re-auth.
      // Let's check against the vocal user assigned to the match.
    }

    // Better approach:
    // If Admin: Can access if passwordAttempt matches THEIR password OR Assigned Vocal's password.
    // If Vocal: Can access only if passwordAttempt matches THEIR password (and they are assigned).

    // Let's fetch the vocal assigned
    const vocalia = await vocaliaRepository.findByMatchId(matchId);
    if (!vocalia) throw new Error("Vocalía no encontrada");

    const assignedVocalId = vocalia.vocal_user_id;

    // Fetch the assigned vocal user to get password hash
    const assignedVocal = await prisma.users.findUnique({
      where: { user_id: assignedVocalId },
    });

    // Fetch current user (admin) to get password hash if needed
    const currentDbUser = await prisma.users.findUnique({
      where: { user_id: BigInt(currentUser.id) },
    });

    if (!assignedVocal) throw new Error("Usuario vocal no encontrado");

    // Check against Assigned Vocal
    let isVocalPasswordValid = false;
    if (assignedVocal) {
      isVocalPasswordValid = await argon2.verify(
        assignedVocal.user_password,
        passwordAttempt,
      );
    }

    // Check against Current User (Admin)
    let isAdminPasswordValid = false;
    if (currentUser.rol === "ADMIN" && currentDbUser) {
      isAdminPasswordValid = await argon2.verify(
        currentDbUser.user_password,
        passwordAttempt,
      );
    }

    if (isVocalPasswordValid || isAdminPasswordValid) {
      return true;
    }

    throw new Error("Contraseña incorrecta");
  }

  async revertFinalization(matchId: number) {
    return prisma.$transaction(async (tx) => {
      const match = await tx.matches.findUnique({
        where: { match_id: BigInt(matchId) },
      });

      if (!match) throw new Error("Partido no encontrado");
      if (match.status !== "finalizado")
        throw new Error("El partido no está finalizado");

      // We need to reverse the stats update.
      // This requires knowing what was added.
      // The current implementation calculates points based on score.
      // We can recalculate what WAS added based on the CURRENT scores in the match record.

      const {
        local_score,
        away_score,
        tournament_id,
        local_team_id,
        away_team_id,
      } = match;

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

      if (local_score > away_score) {
        result.localPoints = 3;
        result.localWon = 1;
        result.awayLost = 1;
      } else if (local_score < away_score) {
        result.awayPoints = 3;
        result.awayWon = 1;
        result.localLost = 1;
      } else {
        result.localPoints = 1;
        result.awayPoints = 1;
        result.localDraw = 1;
        result.awayDraw = 1;
      }

      // DECREMENT stats
      const [localTT, awayTT] = await Promise.all([
        tx.tournament_teams.findUnique({
          where: {
            uq_tournament_team: { tournament_id, team_id: local_team_id },
          },
        }),
        tx.tournament_teams.findUnique({
          where: {
            uq_tournament_team: { tournament_id, team_id: away_team_id },
          },
        }),
      ]);

      if (localTT) {
        await tx.tournament_teams.update({
          where: { tournament_team_id: localTT.tournament_team_id },
          data: {
            played: { decrement: 1 },
            won: { decrement: result.localWon },
            drawn: { decrement: result.localDraw },
            lost: { decrement: result.localLost },
            goals_for: { decrement: local_score },
            goals_against: { decrement: away_score },
            goal_diff: { decrement: local_score - away_score },
            points: { decrement: result.localPoints },
          },
        });
      }

      if (awayTT) {
        await tx.tournament_teams.update({
          where: { tournament_team_id: awayTT.tournament_team_id },
          data: {
            played: { decrement: 1 },
            won: { decrement: result.awayWon },
            drawn: { decrement: result.awayDraw },
            lost: { decrement: result.awayLost },
            goals_for: { decrement: away_score },
            goals_against: { decrement: local_score },
            goal_diff: { decrement: away_score - local_score },
            points: { decrement: result.awayPoints },
          },
        });
      }

      // Set status back to en_curso
      await tx.matches.update({
        where: { match_id: BigInt(matchId) },
        data: { status: "en_curso" },
      });

      await invalidateTournamentStats(Number(tournament_id));

      return { ok: true, message: "Partido revertido a estado en curso" };
    });
  }
}

export const vocaliaService = new VocaliaService();

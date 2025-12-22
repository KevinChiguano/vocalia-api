import { redis } from "../config/redis";
import prisma from "../config/prisma";

/**
 * Invalida todas las estadísticas cacheadas de un torneo
 */
export const invalidateTournamentStats = async (
  tournamentId: number | bigint
) => {
  try {
    const keys = await redis.keys(`stats:*:${tournamentId}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn(
      `[CACHE] No se pudo invalidar stats del torneo ${tournamentId}`,
      error
    );
  }
};

/**
 * Invalida estadísticas a partir de un matchId
 * (deriva el tournamentId internamente)
 */
export const invalidateStatsByMatch = async (matchId: number | bigint) => {
  try {
    const match = await prisma.matches.findUnique({
      where: { match_id: BigInt(matchId) },
      select: { tournament_id: true },
    });

    if (!match) return;

    await invalidateTournamentStats(match.tournament_id);
  } catch (error) {
    console.warn(
      `[CACHE] No se pudo invalidar stats por match ${matchId}`,
      error
    );
  }
};

import prisma from "@/config/prisma";
import { statisticsRepository } from "./statistics.repository";
import { redis } from "@/config/redis";

const CACHE_TTL = 60 * 5; // 5 minutos

export class StatisticsService {
  async playersStatsByTournament(tournamentId: number, page = 1, limit = 20) {
    const cacheKey = `stats:players:${tournamentId}:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const skip = (page - 1) * limit;

    const [players, total] = await Promise.all([
      statisticsRepository.playersByTournament(tournamentId, skip, limit),
      statisticsRepository.countPlayersByTournament(tournamentId),
    ]);

    const totalPages = Math.ceil(total / limit);

    const [goals, sanctions, matches] = await Promise.all([
      statisticsRepository.goalsByPlayer(tournamentId),
      statisticsRepository.sanctionsByPlayer(tournamentId),
      statisticsRepository.matchesPlayedByPlayer(tournamentId),
    ]);

    const goalsMap = new Map(
      goals.map((g) => [Number(g.player_id), g._count.player_id])
    );

    const matchesMap = new Map(
      matches.map((m) => [Number(m.player_id), m._count.match_id])
    );

    const yellowMap = new Map<number, number>();
    const redMap = new Map<number, number>();

    sanctions.forEach((s) => {
      const id = Number(s.player_id);
      if (s.type === "amarilla") yellowMap.set(id, s._count.type);
      if (s.type === "roja_directa" || s.type === "doble_amarilla") {
        redMap.set(id, (redMap.get(id) || 0) + s._count.type);
      }
    });

    const response = {
      items: players.map((p) => ({
        player: {
          id: p.player_id,
          name: `${p.player_name} ${p.player_lastname ?? ""}`.trim(),
          number: p.player_number,
        },
        team: {
          id: p.team.team_id,
          name: p.team.team_name,
        },
        matchesPlayed: matchesMap.get(Number(p.player_id)) || 0,
        goals: goalsMap.get(Number(p.player_id)) || 0,
        yellowCards: yellowMap.get(Number(p.player_id)) || 0,
        redCards: redMap.get(Number(p.player_id)) || 0,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TTL);

    return response;
  }

  async teamsStatsByTournament(tournamentId: number) {
    const [teams, sanctions] = await Promise.all([
      statisticsRepository.teamsByTournament(tournamentId),
      statisticsRepository.sanctionsBase(tournamentId),
    ]);

    const players = await prisma.players.findMany({
      where: {
        matchPlayers: {
          some: {
            match: {
              tournament_id: BigInt(tournamentId),
            },
          },
        },
      },
      select: {
        player_id: true,
        team_id: true,
      },
    });

    const teamPlayers = new Map<number, number[]>();

    players.forEach((p) => {
      const list = teamPlayers.get(Number(p.team_id)) ?? [];
      list.push(Number(p.player_id));
      teamPlayers.set(Number(p.team_id), list);
    });

    return teams.map((t) => {
      const ids = teamPlayers.get(Number(t.team_id)) ?? [];

      const yellowCards = sanctions
        .filter(
          (s) => s.type === "amarilla" && ids.includes(Number(s.player_id))
        )
        .reduce((sum, s) => sum + s._count.type, 0);

      const redCards = sanctions
        .filter(
          (s) =>
            (s.type === "roja_directa" || s.type === "doble_amarilla") &&
            ids.includes(Number(s.player_id))
        )
        .reduce((sum, s) => sum + s._count.type, 0);

      return {
        team: {
          id: t.team_id,
          name: t.team.team_name,
        },
        played: t.played,
        won: t.won,
        drawn: t.drawn,
        lost: t.lost,
        goalsFor: t.goals_for,
        goalsAgainst: t.goals_against,
        goalDiff: t.goal_diff,
        points: t.points,
        yellowCards,
        redCards,
      };
    });
  }

  async topScorersByTournament(tournamentId: number, limit = 10) {
    const goals = await statisticsRepository.topScorers(tournamentId, limit);

    const players = await prisma.players.findMany({
      where: {
        player_id: { in: goals.map((g) => g.player_id) },
      },
      select: {
        player_id: true,
        player_name: true,
        player_lastname: true,
        team: {
          select: { team_name: true },
        },
      },
    });

    return goals.map((g) => {
      const p = players.find((p) => p.player_id === g.player_id)!;
      return {
        player: {
          id: p.player_id,
          name: `${p.player_name} ${p.player_lastname ?? ""}`.trim(),
        },
        team: p.team.team_name,
        goals: g._count.player_id,
      };
    });
  }
  async dashboardStats(tournamentId: number) {
    const cacheKey = `stats:dashboard:${tournamentId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await statisticsRepository.dashboardCounts(tournamentId);

    const yellowCards =
      data.sanctions.find((s) => s.type === "amarilla")?._count.type ?? 0;

    const redCards = data.sanctions
      .filter((s) => s.type !== "amarilla")
      .reduce((sum, s) => sum + s._count.type, 0);

    const response = {
      counts: {
        teams: data.teams,
        players: data.players,
        matches: data.matches,
        goals: data.goals,
        yellowCards,
        redCards,
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);
    return response;
  }

  async globalDashboardStats() {
    const cacheKey = "stats:dashboard:global";

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const data = await statisticsRepository.globalDashboardCounts();

    const yellowCards =
      data.sanctions.find((s) => s.type === "amarilla")?._count.type ?? 0;

    const redCards = data.sanctions
      .filter((s) => s.type === "roja_directa" || s.type === "doble_amarilla")
      .reduce((sum, s) => sum + s._count.type, 0);

    const response = {
      counts: {
        tournaments: data.tournaments,
        teams: data.teams,
        players: data.players,
        matches: data.matches,
        goals: data.goals,
        yellowCards,
        redCards,
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TTL);

    return response;
  }
}

export const statisticsService = new StatisticsService();

// statistics.repository.ts
import prisma from "../../config/prisma";
import type { PrismaTx } from "../../config/prisma.types";

export class StatisticsRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  // ⚽ Goles por jugador
  async goalsByPlayer(tournamentId: number, tx?: PrismaTx) {
    return this.getClient(tx).goals.groupBy({
      by: ["player_id"],
      where: {
        match: {
          tournament_id: BigInt(tournamentId),
        },
        is_own_goal: false,
      },
      _count: { player_id: true },
    });
  }

  // 🟨🟥 Tarjetas por jugador
  async sanctionsByPlayer(tournamentId: number, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.groupBy({
      by: ["player_id", "type"],
      where: {
        match: {
          tournament_id: BigInt(tournamentId),
        },
      },
      _count: { type: true },
    });
  }

  // 🧢 Partidos jugados por jugador
  async matchesPlayedByPlayer(tournamentId: number) {
    return this.getClient().match_players.groupBy({
      by: ["player_id"],
      where: {
        match: {
          tournament_id: BigInt(tournamentId),
        },
      },
      _count: {
        match_id: true,
      },
    });
  }

  // 📄 Jugadores del torneo
  async playersByTournament(tournamentId: number, skip = 0, take = 20) {
    return this.getClient().players.findMany({
      where: {
        matchPlayers: {
          some: {
            match: {
              tournament_id: BigInt(tournamentId),
            },
          },
        },
      },
      skip,
      take,
      orderBy: {
        player_id: "asc",
      },
      select: {
        player_id: true,
        player_name: true,
        player_lastname: true,
        player_number: true,
        team: {
          select: {
            team_id: true,
            team_name: true,
          },
        },
      },
    });
  }

  async countPlayersByTournament(tournamentId: number) {
    return this.getClient().players.count({
      where: {
        matchPlayers: {
          some: {
            match: {
              tournament_id: BigInt(tournamentId),
            },
          },
        },
      },
    });
  }

  // 🏆 Tabla de equipos
  async teamsByTournament(tournamentId: number, tx?: PrismaTx) {
    return this.getClient(tx).tournament_teams.findMany({
      where: { tournament_id: BigInt(tournamentId) },
      select: {
        team_id: true,
        played: true,
        won: true,
        drawn: true,
        lost: true,
        goals_for: true,
        goals_against: true,
        goal_diff: true,
        points: true,
        team: {
          select: {
            team_name: true,
          },
        },
      },
      orderBy: [{ points: "desc" }, { goal_diff: "desc" }],
    });
  }

  // 🟨🟥 Tarjetas (base para equipos)
  async sanctionsBase(tournamentId: number, tx?: PrismaTx) {
    return this.getClient(tx).sanctions.groupBy({
      by: ["player_id", "type"],
      where: {
        match: {
          tournament_id: BigInt(tournamentId),
        },
      },
      _count: { type: true },
    });
  }

  // 🥅 Goleadores
  async topScorers(tournamentId: number, limit = 10, tx?: PrismaTx) {
    return this.getClient(tx).goals.groupBy({
      by: ["player_id"],
      where: {
        match: {
          tournament_id: BigInt(tournamentId),
        },
        is_own_goal: false,
      },
      _count: { player_id: true },
      orderBy: {
        _count: { player_id: "desc" },
      },
      take: limit,
    });
  }
}

export const statisticsRepository = new StatisticsRepository();

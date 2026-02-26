// statistics.repository.ts
import prisma from "@/config/prisma";
export class StatisticsRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    // ⚽ Goles por jugador
    async goalsByPlayer(tournamentId, tx) {
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
    async sanctionsByPlayer(tournamentId, tx) {
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
    async matchesPlayedByPlayer(tournamentId) {
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
    async playersByTournament(tournamentId, skip = 0, take = 20) {
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
                player_image_url: true,
                team: {
                    select: {
                        team_id: true,
                        team_name: true,
                        team_logo: true,
                    },
                },
            },
        });
    }
    async countPlayersByTournament(tournamentId) {
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
    async teamsByTournament(tournamentId, tx) {
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
                        team_logo: true,
                    },
                },
            },
            orderBy: [{ points: "desc" }, { goal_diff: "desc" }],
        });
    }
    // 🟨🟥 Tarjetas (base para equipos)
    async sanctionsBase(tournamentId, tx) {
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
    async topScorers(tournamentId, limit = 10, tx) {
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
    async dashboardCounts(tournamentId) {
        const client = this.getClient();
        const [teams, players, matches, goals, sanctions] = await Promise.all([
            client.tournament_teams.count({
                where: { tournament_id: BigInt(tournamentId) },
            }),
            client.players.count({
                where: {
                    matchPlayers: {
                        some: { match: { tournament_id: BigInt(tournamentId) } },
                    },
                },
            }),
            client.matches.count({ where: { tournament_id: BigInt(tournamentId) } }),
            client.goals.count({
                where: {
                    match: { tournament_id: BigInt(tournamentId) },
                    is_own_goal: false,
                },
            }),
            client.sanctions.groupBy({
                by: ["type"],
                where: { match: { tournament_id: BigInt(tournamentId) } },
                _count: { type: true },
            }),
        ]);
        return { teams, players, matches, goals, sanctions };
    }
    async globalDashboardCounts(tx) {
        const client = this.getClient(tx);
        const [tournaments, teams, players, matches, goals, sanctions] = await Promise.all([
            client.tournaments.count(),
            client.teams.count(),
            client.players.count(),
            client.matches.count(),
            client.goals.count({
                where: { is_own_goal: false },
            }),
            client.sanctions.groupBy({
                by: ["type"],
                _count: { type: true },
            }),
        ]);
        return {
            tournaments,
            teams,
            players,
            matches,
            goals,
            sanctions,
        };
    }
}
export const statisticsRepository = new StatisticsRepository();

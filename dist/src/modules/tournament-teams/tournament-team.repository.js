import prisma from "@/config/prisma";
export const tournamentTeamSelectFields = {
    tournament_team_id: true,
    tournament_id: true,
    team_id: true,
    played: true,
    won: true,
    drawn: true,
    lost: true,
    goals_for: true,
    goals_against: true,
    goal_diff: true,
    points: true,
    created_at: true,
    updated_at: true,
    team: {
        select: {
            team_id: true,
            team_name: true,
            team_logo: true,
            category: {
                select: {
                    category_id: true,
                    name: true,
                },
            },
        },
    },
    category_id: true,
    category: {
        select: {
            name: true,
        },
    },
};
export class TournamentTeamRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async create(data, tx) {
        return this.getClient(tx).tournament_teams.create({
            data,
            select: tournamentTeamSelectFields,
        });
    }
    async findByTournament(tournamentId, tx) {
        return this.getClient(tx).tournament_teams.findMany({
            where: { tournament_id: BigInt(tournamentId) },
            select: tournamentTeamSelectFields,
            orderBy: [{ points: "desc" }, { goal_diff: "desc" }],
        });
    }
    async findById(id, tx) {
        return this.getClient(tx).tournament_teams.findUnique({
            where: { tournament_team_id: BigInt(id) },
            select: tournamentTeamSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).tournament_teams.update({
            where: { tournament_team_id: BigInt(id) },
            data,
            select: tournamentTeamSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).tournament_teams.delete({
            where: { tournament_team_id: BigInt(id) },
        });
    }
}
export const tournamentTeamRepository = new TournamentTeamRepository();

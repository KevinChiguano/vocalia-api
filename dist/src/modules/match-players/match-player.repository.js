// match-player.repository.ts
import prisma from "@/config/prisma";
export const matchPlayerSelectFields = {
    match_player_id: true,
    is_starting: true,
    player: {
        select: {
            player_id: true,
            player_name: true,
            player_lastname: true,
            player_number: true,
        },
    },
    team: {
        select: {
            team_id: true,
            team_name: true,
        },
    },
};
export class MatchPlayerRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async create(data, tx) {
        return this.getClient(tx).match_players.create({
            data,
            select: matchPlayerSelectFields,
        });
    }
    async createMany(data, tx) {
        return this.getClient(tx).match_players.createMany({
            data,
            skipDuplicates: true,
        });
    }
    async findByMatch(matchId, tx) {
        return this.getClient(tx).match_players.findMany({
            where: { match_id: matchId },
            select: matchPlayerSelectFields,
        });
    }
    async deleteByMatch(matchId, tx) {
        return this.getClient(tx).match_players.deleteMany({
            where: { match_id: matchId },
        });
    }
}
export const matchPlayerRepository = new MatchPlayerRepository();

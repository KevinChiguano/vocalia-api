import prisma from "@/config/prisma";
export const matchSelectFields = {
    match_id: true,
    match_date: true,
    stage: true,
    // location: true, // Eliminado
    status: true,
    local_score: true,
    away_score: true,
    category: true,
    tournament_id: true,
    local_team_id: true,
    away_team_id: true,
    video_url: true,
    field_id: true,
    localTeam: {
        select: {
            team_id: true,
            team_name: true,
        },
    },
    awayTeam: {
        select: {
            team_id: true,
            team_name: true,
        },
    },
    tournament: {
        select: {
            tournament_id: true,
            name: true,
        },
    },
    field: {
        select: {
            field_id: true,
            name: true,
            location: true,
        },
    },
    vocalias: {
        select: {
            vocalUser: {
                select: {
                    user_id: true,
                    user_name: true,
                },
            },
        },
    },
};
export class MatchRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.matches.findMany({
            ...params,
            select: params.select ?? matchSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.matches.findUnique({
            where: { match_id: BigInt(id) },
            select: matchSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).matches.create({
            data,
            select: matchSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).matches.update({
            where: { match_id: BigInt(id) },
            data,
            select: matchSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).matches.delete({
            where: { match_id: BigInt(id) },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).matches.count(params);
    }
}
export const matchRepository = new MatchRepository();

// league.repository.ts
import prisma from "@/config/prisma";
export const leagueSelectFields = {
    league_id: true,
    name: true,
    image_url: true,
    is_active: true,
    created_at: true,
    updated_at: true,
};
export class LeagueRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.leagues.findMany({
            ...params,
            select: params.select ?? leagueSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.leagues.findUnique({
            where: { league_id: id },
            select: leagueSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).leagues.create({
            data,
            select: leagueSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).leagues.update({
            where: { league_id: id },
            data,
            select: leagueSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).leagues.delete({
            where: { league_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).leagues.count(params);
    }
}
export const leagueRepository = new LeagueRepository();

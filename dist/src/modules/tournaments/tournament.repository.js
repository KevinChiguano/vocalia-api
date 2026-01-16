// tournament.repository.ts
import prisma from "@/config/prisma";
export const tournamentSelectFields = {
    tournament_id: true,
    league_id: true,
    name: true,
    start_date: true,
    end_date: true,
    is_active: true,
    created_at: true,
};
export class TournamentRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.tournaments.findMany({
            ...params,
            select: params.select ?? tournamentSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.tournaments.findUnique({
            where: { tournament_id: id },
            select: tournamentSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).tournaments.create({
            data,
            select: tournamentSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).tournaments.update({
            where: { tournament_id: id },
            data,
            select: tournamentSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).tournaments.delete({
            where: { tournament_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).tournaments.count(params);
    }
}
export const tournamentRepository = new TournamentRepository();

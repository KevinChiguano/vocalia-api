// substitution.repository.ts
import prisma from "@/config/prisma";
export const substitutionSelectFields = {
    substitution_id: true,
    match_id: true,
    player_out: true,
    player_in: true,
    event_time: true,
    playerOut: {
        select: {
            player_id: true,
            player_name: true,
            player_lastname: true,
            player_number: true,
            player_dni: true,
        },
    },
    playerIn: {
        select: {
            player_id: true,
            player_name: true,
            player_lastname: true,
            player_number: true,
            player_dni: true,
        },
    },
};
export class SubstitutionRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.substitutions.findMany({
            ...params,
            select: params.select ?? substitutionSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.substitutions.findUnique({
            where: { substitution_id: id },
            select: substitutionSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).substitutions.create({
            data,
            select: substitutionSelectFields,
        });
    }
    async createMany(data, tx) {
        return this.getClient(tx).substitutions.createMany({
            data,
            skipDuplicates: true,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).substitutions.update({
            where: { substitution_id: id },
            data,
            select: substitutionSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).substitutions.delete({
            where: { substitution_id: id },
        });
    }
    async deleteByMatchId(matchId, tx) {
        return this.getClient(tx).substitutions.deleteMany({
            where: { match_id: matchId },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).substitutions.count(params);
    }
}
export const substitutionRepository = new SubstitutionRepository();

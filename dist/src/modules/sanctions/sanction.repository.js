// sanction.repository.ts
import prisma from "@/config/prisma";
export const sanctionSelectFields = {
    sanction_id: true,
    match_id: true,
    //player_id: true,
    type: true,
    description: true,
    event_time: true,
    player: {
        select: {
            player_id: true,
            player_name: true,
            player_lastname: true,
            player_number: true,
            player_dni: true,
        },
    },
};
export class SanctionRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.sanctions.findMany({
            ...params,
            select: params.select ?? sanctionSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.sanctions.findUnique({
            where: { sanction_id: id },
            select: sanctionSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).sanctions.create({
            data,
            select: sanctionSelectFields,
        });
    }
    async createMany(data, tx) {
        return this.getClient(tx).sanctions.createMany({
            data,
            skipDuplicates: true,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).sanctions.update({
            where: { sanction_id: id },
            data,
            select: sanctionSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).sanctions.delete({
            where: { sanction_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).sanctions.count(params);
    }
}
export const sanctionRepository = new SanctionRepository();

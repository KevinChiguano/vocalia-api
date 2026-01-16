// team.repository.ts
import prisma from "@/config/prisma";
export const teamSelectFields = {
    team_id: true,
    team_name: true,
    team_logo: true,
    is_active: true,
    created_at: true,
    category: {
        select: {
            name: true,
            category_id: true,
        },
    },
};
export class TeamRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.teams.findMany({
            ...params,
            select: params.select ?? teamSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.teams.findUnique({
            where: { team_id: id },
            select: teamSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).teams.create({
            data,
            select: teamSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).teams.update({
            where: { team_id: id },
            data,
            select: teamSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).teams.delete({
            where: { team_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).teams.count(params);
    }
}
export const teamRepository = new TeamRepository();

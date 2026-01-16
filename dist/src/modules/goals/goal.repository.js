// goal.repository.ts
import prisma from "@/config/prisma";
export const goalSelectFields = {
    goal_id: true,
    //match_id: true,
    //player_id: true,
    event_time: true,
    is_own_goal: true,
    player: {
        select: {
            player_id: true,
            player_name: true,
            player_lastname: true,
            player_number: true,
            player_dni: true,
        },
    },
    match: {
        select: {
            match_id: true,
            local_team_id: true,
            away_team_id: true,
            stage: true,
            status: true,
        },
    },
};
export class GoalRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.goals.findMany({
            ...params,
            select: params.select ?? goalSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.goals.findUnique({
            where: { goal_id: BigInt(id) },
            select: goalSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).goals.create({
            data,
            select: goalSelectFields,
        });
    }
    async createMany(data, tx) {
        return this.getClient(tx).goals.createMany({
            data,
            skipDuplicates: true,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).goals.update({
            where: { goal_id: BigInt(id) },
            data,
            select: goalSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).goals.delete({
            where: { goal_id: BigInt(id) },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).goals.count(params);
    }
    async deleteByMatchId(matchId, tx) {
        return this.getClient(tx).goals.deleteMany({
            where: { match_id: BigInt(matchId) },
        });
    }
}
export const goalRepository = new GoalRepository();

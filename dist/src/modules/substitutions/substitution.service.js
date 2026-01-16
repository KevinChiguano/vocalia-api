// substitution.service.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { convertToEcuadorTime } from "@/utils/convert.time";
import { paginate } from "@/utils/pagination";
import { substitutionRepository, substitutionSelectFields, } from "./substitution.repository";
import { invalidateStatsByMatch } from "@/utils/cache.stats";
const mapSubstitutionKeys = (substitution) => {
    if (!substitution)
        return null;
    const mapPlayer = (player) => ({
        id: player.player_id,
        name: player.player_name,
        lastName: player.player_lastname,
        number: player.player_number,
        dni: player.player_dni,
    });
    const playerOut = substitution.playerOut
        ? mapPlayer(substitution.playerOut)
        : undefined;
    const playerIn = substitution.playerIn
        ? mapPlayer(substitution.playerIn)
        : undefined;
    return {
        id: substitution.substitution_id,
        matchId: substitution.match_id,
        // playerOutId: substitution.player_out,
        // playerInId: substitution.player_in,
        eventTime: convertToEcuadorTime(substitution.event_time),
        playerOut: playerOut,
        playerIn: playerIn,
    };
};
export class SubstitutionService {
    async create(data, tx) {
        const newSubstitution = await substitutionRepository.create({
            match_id: data.matchId,
            player_out: data.playerOut,
            player_in: data.playerIn,
            event_time: new Date(data.eventTime),
        }, tx);
        if (!tx) {
            await invalidateStatsByMatch(data.matchId);
        }
        return mapSubstitutionKeys(newSubstitution);
    }
    async createBulk(data, tx) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("El arreglo de sustituciones está vacío.");
        }
        const substitutionsToInsert = data.map((sub) => ({
            match_id: sub.matchId,
            player_out: sub.playerOut,
            player_in: sub.playerIn,
            event_time: new Date(sub.eventTime),
        }));
        const result = await substitutionRepository.createMany(substitutionsToInsert, tx);
        if (!tx) {
            await invalidateStatsByMatch(data[0].matchId);
        }
        return {
            count: result.count,
            message: `Se insertaron ${result.count} sustituciones de forma masiva.`,
        };
    }
    async update(id, data, tx) {
        const updateData = {};
        if (data.matchId !== undefined)
            updateData.match_id = data.matchId;
        if (data.playerOut !== undefined)
            updateData.player_out = data.playerOut;
        if (data.playerIn !== undefined)
            updateData.player_in = data.playerIn;
        if (data.eventTime)
            updateData.event_time = new Date(data.eventTime);
        if (Object.keys(updateData).length === 0) {
            throw new Error("No hay datos válidos para actualizar la sustitución.");
        }
        try {
            const updatedSubstitution = await substitutionRepository.update(id, updateData, tx);
            return mapSubstitutionKeys(updatedSubstitution);
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                throw new Error(`La sustitución con ID ${id} no existe.`);
            }
            throw e;
        }
    }
    async delete(id, tx) {
        try {
            await substitutionRepository.delete(id, tx);
            return "Sustitución eliminada";
        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                throw new Error(`La sustitución con ID ${id} no fue encontrada para borrar.`);
            }
            throw e;
        }
    }
    async getById(id, tx) {
        const substitution = await substitutionRepository.findById(id, tx);
        return mapSubstitutionKeys(substitution);
    }
    async list(page, limit, filter, tx) {
        const where = {};
        if (filter.matchId !== undefined) {
            where.match_id = filter.matchId;
        }
        if (filter.playerOut !== undefined) {
            where.player_out = filter.playerOut;
        }
        if (filter.playerIn !== undefined) {
            where.player_in = filter.playerIn;
        }
        const result = await paginate(substitutionRepository, // Usamos el Repository
        { page, limit }, {
            where,
            select: substitutionSelectFields,
            orderBy: { substitution_id: "desc" },
        }, tx);
        return {
            items: result.items.map(mapSubstitutionKeys),
            pagination: result.pagination,
        };
    }
}
export const substitutionService = new SubstitutionService();

// player.repository.ts
import prisma from "@/config/prisma";
export const playerSelectFields = {
    player_id: true,
    player_name: true,
    player_lastname: true,
    player_number: true,
    player_dni: true,
    card_image_url: true,
    birth_date: true,
    team_id: true,
    team: {
        select: {
            team_id: true,
            team_name: true,
        },
    },
    category: {
        select: {
            category_id: true,
            name: true,
        },
    },
    is_active: true,
    created_at: true,
};
export class PlayerRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.players.findMany({
            ...params,
            select: params.select ?? playerSelectFields,
        });
    } // Búsqueda por DNI (Identificador único clave)
    async findByDni(dni, tx) {
        const db = this.getClient(tx);
        return db.players.findUnique({
            where: { player_dni: dni },
            select: playerSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).players.create({
            data,
            select: playerSelectFields,
        });
    }
    async update(dni, data, tx) {
        return this.getClient(tx).players.update({
            where: { player_dni: dni }, // Se actualiza por DNI
            data,
            select: playerSelectFields,
        });
    }
    async delete(dni, tx) {
        return this.getClient(tx).players.delete({
            where: { player_dni: dni }, // Se elimina por DNI
        });
    }
    async count(params, tx) {
        return this.getClient(tx).players.count(params);
    }
}
export const playerRepository = new PlayerRepository();

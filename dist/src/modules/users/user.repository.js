// user.repository.ts
import prisma from "@/config/prisma";
export const userSelectFields = {
    user_id: true,
    user_name: true,
    user_email: true,
    is_active: true, // Incluimos la relación 'roles' para que el service pueda mapearla
    roles: {
        select: {
            rol_id: true,
            rol_name: true,
        },
    },
};
export class UserRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findUniqueByEmail(email, tx) {
        const db = this.getClient(tx);
        return db.users.findUnique({
            where: { user_email: email },
            select: userSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.users.findUnique({
            where: { user_id: id },
            select: userSelectFields,
        });
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.users.findMany({
            ...params,
            select: params.select ?? userSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).users.create({
            data,
            select: userSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).users.update({
            where: { user_id: id },
            data,
            select: userSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).users.delete({
            where: { user_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).users.count(params);
    }
}
export const userRepository = new UserRepository();

import prisma from "@/config/prisma";
export const fieldSelectFields = {
    field_id: true,
    name: true,
    location: true,
    is_active: true,
    created_at: true,
    updated_at: true,
};
export class FieldRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.fields.findMany({
            ...params,
            select: params.select ?? fieldSelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.fields.findUnique({
            where: { field_id: BigInt(id) },
            select: fieldSelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).fields.create({
            data,
            select: fieldSelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).fields.update({
            where: { field_id: BigInt(id) },
            data,
            select: fieldSelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).fields.delete({
            where: { field_id: BigInt(id) },
        });
    }
}
export const fieldRepository = new FieldRepository();

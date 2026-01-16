import prisma from "@/config/prisma";
export const categorySelectFields = {
    category_id: true,
    name: true,
    description: true,
    is_active: true,
    created_at: true,
    updated_at: true,
};
export class CategoryRepository {
    getClient(tx) {
        return tx ?? prisma;
    }
    async findMany(params, tx) {
        const db = this.getClient(tx);
        return db.categories.findMany({
            ...params,
            select: params.select ?? categorySelectFields,
        });
    }
    async findById(id, tx) {
        const db = this.getClient(tx);
        return db.categories.findUnique({
            where: { category_id: id },
            select: categorySelectFields,
        });
    }
    async create(data, tx) {
        return this.getClient(tx).categories.create({
            data,
            select: categorySelectFields,
        });
    }
    async update(id, data, tx) {
        return this.getClient(tx).categories.update({
            where: { category_id: id },
            data,
            select: categorySelectFields,
        });
    }
    async delete(id, tx) {
        return this.getClient(tx).categories.delete({
            where: { category_id: id },
        });
    }
    async count(params, tx) {
        return this.getClient(tx).categories.count(params);
    }
}
export const categoryRepository = new CategoryRepository();

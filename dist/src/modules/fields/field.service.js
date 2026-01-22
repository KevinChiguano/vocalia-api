import { fieldRepository } from "./field.repository";
// import { AppError } from "@/utils/AppError";
class FieldService {
    async getAll() {
        return await fieldRepository.findMany({
            orderBy: { name: "asc" },
        });
    }
    async getById(id) {
        const field = await fieldRepository.findById(id);
        if (!field) {
            throw new Error("Cancha no encontrada");
        }
        return field;
    }
    async create(data) {
        const { name, location, isActive } = data;
        // Check if name exists?
        // Usually unique constraint handles it but good to check.
        // fieldRepository.findMany({ where: { name } }) ...
        // But relying on unique constraint is fine for now or I can cache error.
        return await fieldRepository.create({
            name,
            location,
            is_active: isActive ?? true,
        });
    }
    async update(id, data) {
        await this.getById(id); // Ensure exists
        const { name, location, isActive } = data;
        return await fieldRepository.update(id, {
            name,
            location,
            is_active: isActive,
        });
    }
    async delete(id) {
        await this.getById(id);
        return await fieldRepository.delete(id);
    }
}
export const fieldService = new FieldService();

// user.service.ts
import * as argon2 from "argon2";
import { env } from "@/config/env";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { paginate } from "@/utils/pagination";
import { userRepository, userSelectFields } from "./user.repository"; // Importación clave
import { buildSearchFilter, buildBooleanFilter } from "@/utils/filter.builder";
// Opciones de Argon2 (se mantiene aquí como lógica de negocio/seguridad)
const argonOptions = {
    type: argon2.argon2id,
    memoryCost: Number(env.ARGON_MEM) || 2 ** 16,
    timeCost: Number(env.ARGON_TIME) || 3,
    parallelism: Number(env.ARGON_PARALLEL) || 1,
};
const mapUserKeys = (user) => {
    if (!user)
        return null;
    return {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        isActive: user.is_active,
        roles: user.roles
            ? {
                id: user.roles.rol_id,
                name: user.roles.rol_name,
            }
            : null,
    };
};
export class UserService {
    async create(data, tx) {
        const exists = await userRepository.findUniqueByEmail(data.email, tx);
        if (exists)
            throw new Error("Email already in use");
        const hashed = await argon2.hash(data.password, argonOptions);
        const newUser = await userRepository.create({
            user_name: data.name,
            user_email: data.email,
            user_password: hashed,
            rol_id: data.rolId,
            is_active: true,
        }, tx);
        return mapUserKeys(newUser);
    }
    async update(id, data, tx) {
        const updateData = {};
        if (data.name)
            updateData.user_name = data.name;
        if (data.email)
            updateData.user_email = data.email;
        if (data.rolId)
            updateData.rol_id = data.rolId;
        if (typeof data.isActive === "boolean")
            updateData.is_active = data.isActive;
        if (data.password)
            updateData.user_password = await argon2.hash(data.password, argonOptions);
        if (Object.keys(updateData).length === 0) {
            throw new Error("No hay datos válidos para actualizar.");
        }
        try {
            const updatedUser = await userRepository.update(id, updateData, tx);
            return mapUserKeys(updatedUser);
        }
        catch (e) {
            // Manejo de error específico de Prisma por no encontrar el registro a actualizar
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                throw new Error(`El usuario con ID ${id} no existe.`);
            }
            throw e;
        }
    }
    async delete(id, tx) {
        try {
            await userRepository.delete(id, tx); // En este caso el service no necesita retornar el objeto borrado, solo confirmar
            return "Usuario eliminado";
        }
        catch (e) {
            // Manejo de error específico de Prisma por no encontrar el registro a borrar
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                throw new Error(`El usuario con ID ${id} no fue encontrado para eliminar.`);
            }
            throw e;
        }
    }
    async getById(id, tx) {
        const user = await userRepository.findById(id, tx);
        return mapUserKeys(user);
    }
    async list(page, limit, filter = {}, tx) {
        const where = {};
        if (filter.rolId !== undefined) {
            where.rol_id = filter.rolId;
        }
        Object.assign(where, buildBooleanFilter("is_active", filter.is_active), buildSearchFilter(filter.search, ["user_name", "user_email"]));
        const result = await paginate(userRepository, // Pasamos la instancia del repository
        { page, limit }, {
            where,
            orderBy: { user_id: "desc" },
            select: userSelectFields,
        }, tx);
        return {
            items: result.items.map(mapUserKeys),
            pagination: result.pagination,
        };
    }
    async getRoles(tx) {
        const roles = await userRepository.getRoles(tx);
        return roles.map((role) => ({
            id: Number(role.rol_id),
            name: role.rol_name,
        }));
    }
    async toggleStatus(id, tx) {
        const user = await userRepository.findById(id, tx);
        if (!user)
            throw new Error(`El usuario con ID ${id} no existe.`);
        const updatedUser = await userRepository.update(id, { is_active: !user.is_active }, tx);
        return mapUserKeys(updatedUser);
    }
}
export const userService = new UserService(); // Exportamos la instancia de la clase

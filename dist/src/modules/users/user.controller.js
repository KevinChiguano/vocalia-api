import { userService } from "./user.service"; // Ahora es una instancia de la clase
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler"; // <-- ASUMIDO: Usar si existe
import { parseBoolean, parseString, parseNumber } from "@/utils/parseFilters";
export const userController = {
    create: async (req, res) => {
        try {
            const validated = req.body; // Usamos .create en lugar de .createUser
            const user = await userService.create(validated);
            return res.status(201).json(ok(user));
        }
        catch (e) {
            // Si handlePrismaError no está disponible, usar: return res.status(400).json(fail(e.message));
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body; // Usamos .update en lugar de .updateUser
            const user = await userService.update(id, validated);
            return res.json(ok(user));
        }
        catch (e) {
            // Si handlePrismaError no está disponible, usar la lógica de status actual
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id); // Usamos .delete en lugar de .deleteUser
            await userService.delete(id);
            return res.json(ok("Usuario eliminado."));
        }
        catch (e) {
            // Si handlePrismaError no está disponible, usar la lógica de status actual
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id); // Usamos .getById en lugar de .getUserById
            const user = await userService.getById(id);
            if (!user) {
                return res
                    .status(404)
                    .json(fail(`Usuario con ID ${id} no encontrado.`));
            }
            return res.json(ok(user));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    list: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const filter = {
            is_active: parseBoolean(req.query.active),
            search: parseString(req.query.search),
            rolId: parseNumber(req.query.rolId, { min: 1 }),
        };
        try {
            // Usamos .list en lugar de .getUsers
            const result = await userService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            // Ajustado para seguir el patrón de goal.controller.ts (aunque el error 500 es más general)
            return res
                .status(500)
                .json(fail("Error al obtener la lista de usuarios."));
        }
    },
};

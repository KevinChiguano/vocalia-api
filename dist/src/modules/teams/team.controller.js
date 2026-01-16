import { teamService } from "./team.service";
import { ok, fail } from "@/utils/response";
// Asumimos handlePrismaError para mantener la consistencia
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseBoolean, parseString } from "@/utils/parseFilters";
export const teamController = {
    create: async (req, res) => {
        try {
            const validated = req.body; // Cambio de nombre de método: createTeam -> create
            const team = await teamService.create(validated);
            return res.status(201).json(ok(team));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body; // Cambio de nombre de método: updateTeam -> update
            const team = await teamService.update(id, validated);
            return res.json(ok(team));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id); // Cambio de nombre de método: deleteTeam -> delete
            await teamService.delete(id);
            return res.json(ok("Equipo eliminado."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id); // Cambio de nombre de método: getTeamById -> getById
            const team = await teamService.getById(id);
            if (!team) {
                return res.status(404).json(fail(`Equipo con ID ${id} no encontrado.`));
            }
            return res.json(ok(team));
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
            category: parseString(req.query.category),
        };
        try {
            // Cambio de nombre de método: getTeams -> list
            const result = await teamService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de equipos."));
        }
    },
};

import { leagueService } from "./league.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseBoolean, parseString } from "@/utils/parseFilters";
export const leagueController = {
    create: async (req, res) => {
        try {
            const validated = req.body;
            const league = await leagueService.create(validated);
            return res.status(201).json(ok(league));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body;
            const league = await leagueService.update(id, validated);
            return res.json(ok(league));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await leagueService.delete(id);
            return res.json(ok("Liga eliminada."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const league = await leagueService.getById(id);
            if (!league) {
                return res.status(404).json(fail(`Liga con ID ${id} no encontrada.`));
            }
            return res.json(ok(league));
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
        };
        try {
            const result = await leagueService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de ligas."));
        }
    },
};

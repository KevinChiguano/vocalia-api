import { matchService } from "./match.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseNumber, parseString, parseDate, parseEnum } from "@/utils/parseFilters";
export const matchController = {
    create: async (req, res) => {
        try {
            const validated = req.body;
            const match = await matchService.create(validated);
            return res.status(201).json(ok(match));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body;
            const match = await matchService.update(id, validated);
            return res.json(ok(match));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await matchService.delete(id);
            return res.json(ok("Partido eliminado."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const match = await matchService.getById(id);
            if (!match) {
                return res
                    .status(404)
                    .json(fail(`Partido con ID ${id} no encontrado.`));
            }
            return res.json(ok(match));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    list: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const filter = {
            tournamentId: parseNumber(req.query.tournamentId, { min: 1 }),
            status: parseEnum(req.query.status, ["programado", "en_curso", "finalizado", "suspendido", "cancelado"]),
            stage: parseString(req.query.stage),
            matchDateFrom: parseDate(req.query.matchDateFrom),
            matchDateTo: parseDate(req.query.matchDateTo),
        };
        try {
            const result = await matchService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de partidos."));
        }
    },
};

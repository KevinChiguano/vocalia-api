import { goalService } from "./goal.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseNumber, parseBoolean } from "@/utils/parseFilters";
export const goalController = {
    create: async (req, res) => {
        try {
            const goal = await goalService.create(req.body);
            return res.status(201).json(ok(goal));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    bulkCreate: async (req, res) => {
        try {
            const result = await goalService.createBulk(req.body);
            return res.status(201).json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const updated = await goalService.update(id, req.body);
            return res.json(ok(updated));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await goalService.delete(id);
            return res.json(ok("Gol eliminado."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const goal = await goalService.getById(id);
            if (!goal)
                return res.status(404).json(fail("No encontrado."));
            return res.json(ok(goal));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    list: async (req, res) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const filter = {
                matchId: parseNumber(req.query.matchId, { min: 1 }),
                playerId: parseNumber(req.query.playerId, { min: 1 }),
                isOwnGoal: parseBoolean(req.query.isOwnGoal),
            };
            const result = await goalService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de goles."));
        }
    },
};

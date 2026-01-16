import { sanctionService } from "./sanction.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler"; // Asumido para consistencia
import { parseNumber, parseEnum } from "@/utils/parseFilters";
export const sanctionController = {
    create: async (req, res) => {
        try {
            const validated = req.body; // Cambio de nombre de método: createSanction -> create
            const sanction = await sanctionService.create(validated);
            return res.status(201).json(ok(sanction));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    bulkCreate: async (req, res) => {
        try {
            const validatedArray = req.body;
            if (!Array.isArray(validatedArray) || validatedArray.length === 0) {
                return res
                    .status(400)
                    .json(fail("Se espera un array no vacío de sanciones."));
            } // Cambio de nombre de método: createSanctionsBulk -> createBulk
            const result = await sanctionService.createBulk(validatedArray);
            return res.status(201).json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body;
            if (isNaN(id)) {
                return res.status(400).json(fail("El ID debe ser un número válido."));
            } // Cambio de nombre de método: updateSanction -> update
            const sanction = await sanctionService.update(id, validated);
            return res.json(ok(sanction));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json(fail("El ID debe ser un número válido."));
            } // Cambio de nombre de método: deleteSanction -> delete
            await sanctionService.delete(id);
            return res.json(ok("Sanción eliminada."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json(fail("El ID debe ser un número válido."));
            } // Cambio de nombre de método: getSanctionById -> getById
            const sanction = await sanctionService.getById(id);
            if (!sanction) {
                return res
                    .status(404)
                    .json(fail(`Sanción con ID ${id} no encontrada.`));
            }
            return res.json(ok(sanction));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    list: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const filter = {
            matchId: parseNumber(req.query.matchId, { min: 1 }),
            playerId: parseNumber(req.query.playerId, { min: 1 }),
            type: parseEnum(req.query.type, ["amarilla", "roja_directa", "doble_amarilla"]),
        };
        try {
            // Cambio de nombre de método: getSanctions -> list
            const result = await sanctionService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de sanciones."));
        }
    },
};

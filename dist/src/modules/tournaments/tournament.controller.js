import { tournamentService } from "./tournament.service";
import { ok, fail } from "@/utils/response";
// Importación asumida para un manejo consistente de errores
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseBoolean, parseString, parseDate, } from "@/utils/parseFilters";
export const tournamentController = {
    create: async (req, res) => {
        try {
            const validated = req.body; // Cambio de nombre de método: createTournament -> create
            const tournament = await tournamentService.create(validated);
            return res.status(201).json(ok(tournament));
        }
        catch (e) {
            // Uso de la utilidad de error para consistencia
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = req.body; // Cambio de nombre de método: updateTournament -> update
            const tournament = await tournamentService.update(id, validated);
            return res.json(ok(tournament));
        }
        catch (e) {
            // Uso de la utilidad de error para consistencia
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id); // Cambio de nombre de método: deleteTournament -> delete
            await tournamentService.delete(id);
            return res.json(ok("Torneo eliminado."));
        }
        catch (e) {
            // Uso de la utilidad de error para consistencia
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id); // Cambio de nombre de método: getTournamentById -> getById
            const tournament = await tournamentService.getById(id);
            if (!tournament) {
                return res.status(404).json(fail(`Torneo con ID ${id} no encontrado.`));
            }
            return res.json(ok(tournament));
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
            startFrom: parseDate(req.query.startFrom),
            startTo: parseDate(req.query.startTo),
        };
        try {
            // Cambio de nombre de método: getTournaments -> list
            const result = await tournamentService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            // Se mantiene el manejo de errores general para listado
            return res
                .status(500)
                .json(fail("Error al obtener la lista de torneos."));
        }
    },
};

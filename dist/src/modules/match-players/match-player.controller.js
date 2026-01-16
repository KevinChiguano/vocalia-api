import { matchPlayerService } from "./match-player.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
export const matchPlayerController = {
    bulkCreate: async (req, res) => {
        try {
            const result = await matchPlayerService.bulkCreate(req.body);
            return res.status(201).json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    listByMatch: async (req, res) => {
        try {
            const matchId = Number(req.params.matchId);
            const players = await matchPlayerService.listByMatch(matchId);
            return res.json(ok(players));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    deleteByMatch: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await matchPlayerService.deleteByMatch(id);
            return res.json(ok("Jugadores del partido eliminado."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
};

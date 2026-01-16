import { tournamentTeamService } from "./tournament-team.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
export const tournamentTeamController = {
    create: async (req, res) => {
        try {
            const result = await tournamentTeamService.create(req.body);
            return res.status(201).json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await tournamentTeamService.update(id, req.body);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await tournamentTeamService.delete(id);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    listByTournament: async (req, res) => {
        try {
            const tournamentId = Number(req.params.tournamentId);
            const result = await tournamentTeamService.listByTournament(tournamentId);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
};

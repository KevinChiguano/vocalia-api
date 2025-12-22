// statistics.controller.ts
import { Request, Response } from "express";
import { statisticsService } from "./statistics.service";
import { ok } from "../../utils/response";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

export const statisticsController = {
  playersByTournament: async (req: Request, res: Response) => {
    try {
      const tournamentId = Number(req.params.tournamentId);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await statisticsService.playersStatsByTournament(
        tournamentId,
        page,
        limit
      );

      return res.json(ok(result));
    } catch (e) {
      return handlePrismaError(e, res);
    }
  },

  teamsByTournament: async (req: Request, res: Response) => {
    try {
      const tournamentId = Number(req.params.tournamentId);
      const data = await statisticsService.teamsStatsByTournament(tournamentId);
      return res.json(ok(data));
    } catch (e) {
      return handlePrismaError(e, res);
    }
  },

  topScorers: async (req: Request, res: Response) => {
    try {
      const tournamentId = Number(req.params.tournamentId);
      const limit = Number(req.query.limit) || 10;
      const data = await statisticsService.topScorersByTournament(
        tournamentId,
        limit
      );
      return res.json(ok(data));
    } catch (e) {
      return handlePrismaError(e, res);
    }
  },
};

// statistics.controller.ts
import { Request, Response } from "express";
import { statisticsService } from "./statistics.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";

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

  dashboardByTournament: async (req: Request, res: Response) => {
    try {
      const tournamentId = Number(req.params.tournamentId);

      if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID de torneo inválido",
        });
      }

      const data = await statisticsService.dashboardStats(tournamentId);

      return res.json(ok(data));
    } catch (e) {
      return handlePrismaError(e, res);
    }
  },

  globalDashboard: async (_req: Request, res: Response) => {
    try {
      const data = await statisticsService.globalDashboardStats();
      return res.json(ok(data));
    } catch (e) {
      return handlePrismaError(e, res);
    }
  },
};

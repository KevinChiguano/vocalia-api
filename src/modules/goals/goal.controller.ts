import { Request, Response } from "express";
import { goalService } from "./goal.service";
import { ok, fail } from "../../utils/response";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

export const goalController = {
  create: async (req: Request, res: Response) => {
    try {
      const goal = await goalService.create(req.body);
      return res.status(201).json(ok(goal));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  bulkCreate: async (req: Request, res: Response) => {
    try {
      const result = await goalService.createBulk(req.body);
      return res.status(201).json(ok(result));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updated = await goalService.update(id, req.body);
      return res.json(ok(updated));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await goalService.delete(id);
      return res.json(ok("Gol eliminado."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const goal = await goalService.getById(id);
      if (!goal) return res.status(404).json(fail("No encontrado."));
      return res.json(ok(goal));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const filter: any = {};

      if (req.query.matchId)
        filter.match_id = BigInt(req.query.matchId as string);

      if (req.query.playerId)
        filter.player_id = BigInt(req.query.playerId as string);

      if (req.query.isOwnGoal)
        filter.is_own_goal = req.query.isOwnGoal === "true";

      const result = await goalService.list(page, limit, filter);
      return res.json(ok(result));
    } catch (e: any) {
      return fail("Error al obtener la lista de goles.");
    }
  },
};

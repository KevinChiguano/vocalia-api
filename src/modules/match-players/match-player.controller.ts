// match-player.controller.ts
import { Request, Response } from "express";
import { matchPlayerService } from "./match-player.service";
import { ok } from "../../utils/response";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

export const matchPlayerController = {
  bulkCreate: async (req: Request, res: Response) => {
    try {
      const result = await matchPlayerService.bulkCreate(req.body);
      return res.status(201).json(ok(result));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  listByMatch: async (req: Request, res: Response) => {
    try {
      const matchId = Number(req.params.matchId);
      const players = await matchPlayerService.listByMatch(matchId);
      return res.json(ok(players));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  deleteByMatch: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await matchPlayerService.deleteByMatch(id);
      return res.json(ok("Jugadores del partido eliminado."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },
};

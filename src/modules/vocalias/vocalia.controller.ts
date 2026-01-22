import { Request, Response } from "express";
import { vocaliaService } from "./vocalia.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";

export const vocaliaController = {
  create: async (req: Request, res: Response) => {
    try {
      const vocalia = await vocaliaService.create(req.body);
      return res.status(201).json(ok(vocalia));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }
      const matchId = Number(req.params.matchId);
      const vocalUserId = req.user.id;

      const updated = await vocaliaService.update(
        matchId,
        req.body,
        vocalUserId,
      );
      return res.json(ok(updated));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  finalize: async (req: Request, res: Response) => {
    try {
      const matchId = Number(req.params.matchId);
      const { localScore, awayScore, vocaliaData } = req.body;
      if (
        typeof localScore !== "number" ||
        typeof awayScore !== "number" ||
        localScore < 0 ||
        awayScore < 0
      ) {
        return res.status(400).json({
          ok: false,
          message: "Marcador inválido",
        });
      }
      const result = await vocaliaService.finalize(matchId, {
        localScore,
        awayScore,
        vocaliaData,
      });
      return res.json(ok(result));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getByMatch: async (req: Request, res: Response) => {
    try {
      const matchId = Number(req.params.matchId);

      try {
        const vocalia = await vocaliaService.getByMatchId(matchId);
        return res.json(ok(vocalia));
      } catch (error: any) {
        // Si no existe vocalía y es ADMIN, devolvemos la "vocalía virtual"
        if (req.user?.rol === "ADMIN") {
          const virtualVocalia =
            await vocaliaService.getMatchAsVocalia(matchId);
          return res.json(ok(virtualVocalia));
        }
        throw error;
      }
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  listMine: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const vocalUserId = req.user.id;

    try {
      const result = await vocaliaService.listByVocal(vocalUserId, page, limit);
      return res.json(ok(result));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },
};

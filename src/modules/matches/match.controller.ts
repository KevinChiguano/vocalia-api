// match.controller.ts
import { Request, Response } from "express";
import { matchService } from "./match.service";
import { ok, fail } from "../../utils/response";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

export const matchController = {
  create: async (req: Request, res: Response) => {
    try {
      const validated = req.body;
      const match = await matchService.create(validated);
      return res.status(201).json(ok(match));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validated = req.body;
      const match = await matchService.update(id, validated);
      return res.json(ok(match));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await matchService.delete(id);
      return res.json(ok("Partido eliminado."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const match = await matchService.getById(id);

      if (!match) {
        return res
          .status(404)
          .json(fail(`Partido con ID ${id} no encontrado.`));
      }

      return res.json(ok(match));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter: any = {};

    if (req.query.tournamentId)
      filter.tournament_id = Number(req.query.tournamentId);

    if (req.query.status) filter.status = req.query.status;

    if (req.query.stage)
      filter.stage = { contains: req.query.stage, mode: "insensitive" };

    try {
      const result = await matchService.list(page, limit, filter);
      return res.json(ok(result));
    } catch (e: any) {
      return res
        .status(500)
        .json(fail("Error al obtener la lista de partidos."));
    }
  },
};

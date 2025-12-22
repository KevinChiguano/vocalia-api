// substitution.controller.ts
import { Request, Response } from "express";
import { substitutionService } from "./substitution.service";
import { ok, fail } from "../../utils/response";
import { CreateSubstitutionInput } from "./substitution.schema";
// Asumimos handlePrismaError para mantener la consistencia
import { handlePrismaError } from "../../utils/prismaErrorHandler";

export const substitutionController = {
  create: async (req: Request, res: Response) => {
    try {
      const validated = req.body; // Cambio de nombre de método: createSubstitution -> create
      const substitution = await substitutionService.create(validated);
      return res.status(201).json(ok(substitution));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  bulkCreate: async (req: Request, res: Response) => {
    try {
      const validatedArray: CreateSubstitutionInput[] = req.body;

      if (!Array.isArray(validatedArray) || validatedArray.length === 0) {
        return res
          .status(400)
          .json(fail("Se espera un array no vacío de sustituciones."));
      } // Cambio de nombre de método: createSubstitutionsBulk -> createBulk

      const result = await substitutionService.createBulk(validatedArray);

      return res.status(201).json(ok(result));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validated = req.body;

      if (isNaN(id)) {
        return res.status(400).json(fail("El ID debe ser un número válido."));
      } // Cambio de nombre de método: updateSubstitution -> update
      const substitution = await substitutionService.update(id, validated);
      return res.json(ok(substitution));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json(fail("El ID debe ser un número válido."));
      } // Cambio de nombre de método: deleteSubstitution -> delete

      await substitutionService.delete(id);

      return res.json(ok("Sustitución eliminada."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json(fail("El ID debe ser un número válido."));
      } // Cambio de nombre de método: getSubstitutionById -> getById

      const substitution = await substitutionService.getById(id);

      if (!substitution) {
        return res
          .status(404)
          .json(fail(`Sustitución con ID ${id} no encontrada.`));
      }

      return res.json(ok(substitution));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter: any = {};

    if (req.query.matchId) {
      filter.match_id = Number(req.query.matchId);
    }
    if (req.query.playerOut) {
      filter.player_out = Number(req.query.playerOut);
    }
    if (req.query.playerIn) {
      filter.player_in = Number(req.query.playerIn);
    }

    try {
      // Cambio de nombre de método: getSubstitutions -> list
      const result = await substitutionService.list(page, limit, filter);
      return res.json(ok(result));
    } catch (e: any) {
      return res
        .status(500)
        .json(fail("Error al obtener la lista de sustituciones."));
    }
  },
};

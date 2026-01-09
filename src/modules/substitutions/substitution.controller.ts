import { Request, Response } from "express";
import { substitutionService } from "./substitution.service";
import { ok, fail } from "@/utils/response";
import { CreateSubstitutionInput } from "./substitution.schema";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseNumber } from "@/utils/parseFilters";

export const substitutionController = {
  create: async (req: Request, res: Response) => {
    try {
      const validated = req.body;
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
      }

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
      }
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
      }

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
      }

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

    const filter = {
      matchId: parseNumber(req.query.matchId, { min: 1 }),
      playerOut: parseNumber(req.query.playerOut, { min: 1 }),
      playerIn: parseNumber(req.query.playerIn, { min: 1 }),
    };

    try {
      const result = await substitutionService.list(page, limit, filter);
      return res.json(ok(result));
    } catch (e: any) {
      return res
        .status(500)
        .json(fail("Error al obtener la lista de sustituciones."));
    }
  },
};

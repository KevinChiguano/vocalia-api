import { Request, Response } from "express";
import { fieldService } from "./field.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";

export const fieldController = {
  create: async (req: Request, res: Response) => {
    try {
      const validated = req.body;
      const field = await fieldService.create(validated);
      return res.status(201).json(ok(field));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validated = req.body;
      const field = await fieldService.update(id, validated);
      return res.json(ok(field));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await fieldService.delete(id);
      return res.json(ok("Cancha eliminada."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const field = await fieldService.getById(id);
      return res.json(ok(field));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const result = await fieldService.getAll();
      return res.json(ok(result));
    } catch (e: any) {
      return res
        .status(500)
        .json(fail("Error al obtener la lista de canchas."));
    }
  },
};

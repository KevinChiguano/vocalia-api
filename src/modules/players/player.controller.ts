// player.controller.ts
import { Request, Response } from "express";
import { playerService } from "./player.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler"; // Asumido para consistencia
import { parseBoolean, parseString, parseNumber } from "@/utils/parseFilters";

export const playerController = {
  create: async (req: Request, res: Response) => {
    try {
      const validated = req.body; // Cambio de nombre de método: createPlayer -> create
      const player = await playerService.create(validated);
      return res.status(201).json(ok(player));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const dni = String(req.params.dni);
      const validated = req.body; // Cambio de nombre de método: updatePlayer -> update
      const player = await playerService.update(dni, validated);
      return res.json(ok(player));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const dni = String(req.params.dni); // Cambio de nombre de método: deletePlayer -> delete
      await playerService.delete(dni);
      return res.json(ok("Jugador eliminado."));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const dni = String(req.params.dni); // Cambio de nombre de método: getPlayerByDni -> getByDni
      const player = await playerService.getByDni(dni);

      if (!player) {
        return res
          .status(404)
          .json(fail(`Jugador con DNI ${dni} no encontrado.`));
      }

      return res.json(ok(player));
    } catch (e: any) {
      return handlePrismaError(e, res);
    }
  },

  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = {
      is_active: parseBoolean(req.query.active),
      search: parseString(req.query.search),
      teamId: parseNumber(req.query.teamId, { min: 1 }),
      categoryId: parseNumber(req.query.categoryId, { min: 1 }),
    };

    try {
      // Cambio de nombre de método: getPlayers -> list
      const result = await playerService.list(page, limit, filter);
      return res.json(ok(result));
    } catch (e: any) {
      return res
        .status(500)
        .json(fail("Error al obtener la lista de jugadores."));
    }
  },
};

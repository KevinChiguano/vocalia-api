import { Request, Response } from "express";
import { actaService } from "./acta.service";
import { ok, fail } from "@/utils/response";

export const actaController = {
  getByMatch: async (req: Request, res: Response) => {
    const matchId = Number(req.params.matchId);

    if (!Number.isInteger(matchId)) {
      return res.status(400).json(fail("El ID del partido debe ser numérico"));
    }

    try {
      const acta = await actaService.getByMatchId(matchId);
      return res.json(ok(acta));
    } catch (e: any) {
      if (
        e.message === "El partido no existe" ||
        e.message === "El partido no tiene vocalía asignada" ||
        e.message === "El partido aún no ha finalizado"
      ) {
        return res.status(404).json(fail(e.message));
      }

      console.error("Error Acta:", e);
      return res.status(500).json(fail("Error interno al obtener el acta"));
    }
  },
};

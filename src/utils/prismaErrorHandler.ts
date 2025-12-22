import { Prisma } from "../generated/prisma/client";
import { fail } from "./response";
import { Response } from "express";

export const handlePrismaError = (e: any, res: Response) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2025":
        return res.status(404).json(fail("El registro no existe."));
      case "P2002":
        return res
          .status(409)
          .json(fail("Conflicto: ya existe un registro con estos datos."));
      case "P2003":
        return res
          .status(400)
          .json(fail("Violación de integridad referencial."));
      case "P2000":
        return res
          .status(400)
          .json(fail("El valor enviado excede el tamaño permitido."));
      default:
        return res.status(400).json(fail(`Error DB: ${e.message}`));
    }
  }

  // Errores no Prisma
  return res.status(400).json(fail(e.message ?? "Error desconocido"));
};

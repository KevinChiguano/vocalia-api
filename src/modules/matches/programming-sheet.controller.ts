import { Request, Response } from "express";
import { programmingSheetService } from "./programming-sheet.service";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";

export const programmingSheetController = {
  save: async (req: Request, res: Response) => {
    try {
      const result = await programmingSheetService.saveSheet(req.body);
      return res.status(201).json(ok(result));
    } catch (e: any) {
      console.error("Error saving programming sheet:", e);
      return handlePrismaError(e, res);
    }
  },
};

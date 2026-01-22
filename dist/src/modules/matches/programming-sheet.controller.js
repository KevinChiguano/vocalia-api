import { programmingSheetService } from "./programming-sheet.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
export const programmingSheetController = {
    save: async (req, res) => {
        try {
            const result = await programmingSheetService.saveSheet(req.body);
            return res.status(201).json(ok(result));
        }
        catch (e) {
            console.error("Error saving programming sheet:", e);
            return handlePrismaError(e, res);
        }
    },
};

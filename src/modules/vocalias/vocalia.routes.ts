import { Router } from "express";
import { vocaliaController } from "./vocalia.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createVocaliaSchema, updateVocaliaSchema } from "./vocalia.schema";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  roleGuard(["ADMIN"]),
  validateSchema(createVocaliaSchema),
  vocaliaController.create
);

router.put(
  "/:matchId",
  roleGuard(["VOCAL", "ADMIN"]),
  validateSchema(updateVocaliaSchema),
  vocaliaController.update
);

router.post(
  "/:matchId/finalize",
  roleGuard(["ADMIN"]),
  vocaliaController.finalize
);

router.get(
  "/match/:matchId",
  roleGuard(["ADMIN", "VOCAL"]),
  vocaliaController.getByMatch
);

router.get("/mine", roleGuard(["VOCAL"]), vocaliaController.listMine);

export default router;

// match-player.routes.ts
import { Router } from "express";
import { matchPlayerController } from "./match-player.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { bulkCreateMatchPlayerSchema } from "./match-player.schema";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/bulk",
  roleGuard(["ADMIN", "VOCAL"]),
  validateSchema(bulkCreateMatchPlayerSchema),
  matchPlayerController.bulkCreate
);

router.delete(
  "/match/:matchId",
  roleGuard(["ADMIN", "VOCAL"]),
  matchPlayerController.deleteByMatch
);

router.get(
  "/match/:matchId",
  roleGuard(["ADMIN", "VOCAL"]),
  matchPlayerController.listByMatch
);

export default router;

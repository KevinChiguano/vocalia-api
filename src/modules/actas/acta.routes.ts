import { Router } from "express";
import { actaController } from "./acta.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";

const router = Router();

router.get(
  "/:matchId/acta",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN", "VOCAL"]),
  actaController.getByMatch
);

export default router;

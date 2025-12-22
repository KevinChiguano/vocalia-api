import { Router } from "express";
import { tournamentController } from "./tournament.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import {
  createTournamentSchema,
  updateTournamentSchema,
} from "./tournament.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createTournamentSchema),
  tournamentController.create
);

router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateTournamentSchema),
  tournamentController.update
);

router.delete("/:id", roleGuard(["ADMIN"]), tournamentController.delete);

router.get("/", tournamentController.list);

router.get("/:id", tournamentController.getById);

export default router;

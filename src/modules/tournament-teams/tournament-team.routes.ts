import { Router } from "express";
import { tournamentTeamController } from "./tournament-team.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import {
  createTournamentTeamSchema,
  updateTournamentTeamSchema,
} from "./tournament-team.schema";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  roleGuard(["ADMIN"]),
  validateSchema(createTournamentTeamSchema),
  tournamentTeamController.create
);

router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateTournamentTeamSchema),
  tournamentTeamController.update
);

router.delete("/:id", roleGuard(["ADMIN"]), tournamentTeamController.delete);

router.get(
  "/tournament/:tournamentId",
  tournamentTeamController.listByTournament
);

export default router;

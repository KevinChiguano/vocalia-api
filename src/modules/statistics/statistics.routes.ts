import { Router } from "express";
import { statisticsController } from "./statistics.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

// Jugadores (fase 1)
router.get(
  "/tournaments/:tournamentId/players",
  statisticsController.playersByTournament
);

router.get(
  "/tournaments/:tournamentId/teams",
  statisticsController.teamsByTournament
);

router.get(
  "/tournaments/:tournamentId/top-scorers",
  statisticsController.topScorers
);

export default router;

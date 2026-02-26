import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";

import tournamentRoutes from "./modules/tournaments/tournament.routes";
import tournamentTeamRoutes from "./modules/tournament-teams/tournament-team.routes";
import teamRoutes from "./modules/teams/team.routes";
import playerRoutes from "./modules/players/player.routes";
import matchRoutes from "./modules/matches/match.routes";
import goalRoutes from "./modules/goals/goal.routes";
import sanctionRoutes from "./modules/sanctions/sanction.routes";
import substitutionRoutes from "./modules/substitutions/substitution.routes";
import vocaliaRoutes from "./modules/vocalias/vocalia.routes";
import actaRoutes from "./modules/actas/acta.routes";
import matchPlayerRoutes from "./modules/match-players/match-player.routes";
import statisticRoutes from "./modules/statistics/statistics.routes";
import categoryRoutes from "./modules/categories/category.routes";
import fieldRoutes from "./modules/fields/field.routes";
import regulationRoutes from "./modules/regulation/regulation.routes";

import { userController } from "./modules/users/user.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.get("/roles", userController.getRoles);

router.use("/tournaments", tournamentRoutes);
router.use("/tournament-teams", tournamentTeamRoutes);

router.use("/teams", teamRoutes);
router.use("/players", playerRoutes);
router.use("/categories", categoryRoutes);
router.use("/fields", fieldRoutes);

router.use("/matches", matchRoutes);
router.use("/matches", actaRoutes);

router.use("/goals", goalRoutes);
router.use("/sanctions", sanctionRoutes);
router.use("/substitutions", substitutionRoutes);

router.use("/vocalias", vocaliaRoutes);

router.use("/match-players", matchPlayerRoutes);

router.use("/statistics", statisticRoutes);
router.use("/regulation", regulationRoutes);

export default router;

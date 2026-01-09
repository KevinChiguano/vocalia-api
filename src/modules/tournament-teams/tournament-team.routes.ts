import { Router } from "express";
import { tournamentTeamController } from "./tournament-team.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import {
  createTournamentTeamSchema,
  updateTournamentTeamSchema,
} from "./tournament-team.schema";

const router = Router();

router.use(authMiddleware.verifyToken);

/**
 * @openapi
 * /tournament-teams:
 *   post:
 *     summary: Registrar un equipo en un torneo
 *     tags: [TournamentTeams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTournamentTeamRequest'
 *     responses:
 *       201:
 *         description: Equipo registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentTeamResponse'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El equipo ya está inscrito en el torneo
 */
router.post(
  "/",
  roleGuard(["ADMIN"]),
  validateSchema(createTournamentTeamSchema),
  tournamentTeamController.create
);

/**
 * @openapi
 * /tournament-teams/{id}:
 *   put:
 *     summary: Actualizar estadísticas de un equipo en el torneo
 *     tags: [TournamentTeams]
 *
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTournamentTeamRequest'
 *     responses:
 *       200:
 *         description: Registro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentTeamResponse'
 *       404:
 *         description: Registro no encontrado
 */
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateTournamentTeamSchema),
  tournamentTeamController.update
);

/**
 * @openapi
 * /tournament-teams/{id}:
 *   delete:
 *     summary: Eliminar un equipo del torneo
 *     tags: [TournamentTeams]
 *
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Equipo eliminado del torneo
 */
router.delete("/:id", roleGuard(["ADMIN"]), tournamentTeamController.delete);

/**
 * @openapi
 * /tournament-teams/tournament/{tournamentId}:
 *   get:
 *     summary: Listar equipos de un torneo (tabla de posiciones)
 *     tags: [TournamentTeams]
 *
 *     parameters:
 *       - name: tournamentId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de equipos del torneo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentTeamListResponse'
 */
router.get(
  "/tournament/:tournamentId",
  tournamentTeamController.listByTournament
);

export default router;

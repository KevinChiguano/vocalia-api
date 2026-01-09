// match-player.routes.ts
import { Router } from "express";
import { matchPlayerController } from "./match-player.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { bulkCreateMatchPlayerSchema } from "./match-player.schema";

const router = Router();

router.use(authMiddleware.verifyToken);

/**
 * @openapi
 * /match-players/bulk:
 *   post:
 *     summary: Registrar jugadores de un equipo en un partido (planilla)
 *     tags: [MatchPlayers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCreateMatchPlayersRequest'
 *     responses:
 *       201:
 *         description: Jugadores registrados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkCreateMatchPlayersResponse'
 *       400:
 *         description: Error de validación
 */
router.post(
  "/bulk",
  roleGuard(["ADMIN", "VOCAL"]),
  validateSchema(bulkCreateMatchPlayerSchema),
  matchPlayerController.bulkCreate
);

/**
 * @openapi
 * /match-players/match/{matchId}:
 *   delete:
 *     summary: Eliminar jugadores registrados en un partido
 *     tags: [MatchPlayers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Jugadores eliminados correctamente
 */
router.delete(
  "/match/:matchId",
  roleGuard(["ADMIN", "VOCAL"]),
  matchPlayerController.deleteByMatch
);

/**
 * @openapi
 * /match-players/match/{matchId}:
 *   get:
 *     summary: Listar jugadores registrados en un partido
 *     tags: [MatchPlayers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de jugadores del partido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchPlayerListResponse'
 */
router.get(
  "/match/:matchId",
  roleGuard(["ADMIN", "VOCAL"]),
  matchPlayerController.listByMatch
);

export default router;

import { Router } from "express";
import { statisticsController } from "./statistics.controller";
const router = Router();
//router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /tournaments/{tournamentId}/players:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Estadísticas de jugadores por torneo
 *     description: >
 *       Retorna estadísticas paginadas de jugadores de un torneo:
 *       partidos jugados, goles, tarjetas amarillas y rojas.
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del torneo
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Estadísticas de jugadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           player:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               name:
 *                                 type: string
 *                               number:
 *                                 type: number
 *                           team:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               name:
 *                                 type: string
 *                           matchesPlayed:
 *                             type: number
 *                           goals:
 *                             type: number
 *                           yellowCards:
 *                             type: number
 *                           redCards:
 *                             type: number
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         totalPages:
 *                           type: number
 */
router.get("/tournaments/:tournamentId/players", statisticsController.playersByTournament);
/**
 * @openapi
 * /tournaments/{tournamentId}/teams:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Tabla de posiciones del torneo
 *     description: Retorna estadísticas de equipos del torneo (tabla).
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del torneo
 *     responses:
 *       200:
 *         description: Estadísticas de equipos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       team:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *                       played:
 *                         type: number
 *                       won:
 *                         type: number
 *                       drawn:
 *                         type: number
 *                       lost:
 *                         type: number
 *                       goalsFor:
 *                         type: number
 *                       goalsAgainst:
 *                         type: number
 *                       goalDiff:
 *                         type: number
 *                       points:
 *                         type: number
 *                       yellowCards:
 *                         type: number
 *                       redCards:
 *                         type: number
 */
router.get("/tournaments/:tournamentId/teams", statisticsController.teamsByTournament);
/**
 * @openapi
 * /tournaments/{tournamentId}/top-scorers:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Tabla de goleadores del torneo
 *     description: Retorna los jugadores con más goles en el torneo.
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del torneo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Número máximo de goleadores
 *     responses:
 *       200:
 *         description: Lista de goleadores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       player:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *                       team:
 *                         type: string
 *                       goals:
 *                         type: number
 */
router.get("/tournaments/:tournamentId/top-scorers", statisticsController.topScorers);
router.get("/tournaments/:tournamentId/dashboard", statisticsController.dashboardByTournament);
router.get("/dashboard", statisticsController.globalDashboard);
export default router;

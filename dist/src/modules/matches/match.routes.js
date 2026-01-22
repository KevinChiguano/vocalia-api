import { Router } from "express";
import { matchController } from "./match.controller";
import { programmingSheetController } from "./programming-sheet.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createMatchSchema, updateMatchSchema, programmingSheetSchema, } from "./match.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
const router = Router();
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /matches/programming-sheet:
 *   post:
 *     tags: [Matches]
 *     summary: Guardar hoja de programación (creación masiva de partidos y vocalías)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tournamentId:
 *                 type: number
 *               stage:
 *                 type: string
 *               matchDay:
 *                 type: number
 *               rows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     matchDate:
 *                       type: string
 *                       format: date-time
 *                     time:
 *                       type: string
 *                     localTeamId:
 *                       type: number
 *                     awayTeamId:
 *                       type: number
 *                     categoryId:
 *                       type: number
 *                     vocalUserId:
 *                       type: number
 *     responses:
 *       201:
 *         description: Hoja de programación guardada correctamente
 */
router.post("/programming-sheet", roleGuard(["ADMIN"]), validateSchema(programmingSheetSchema), programmingSheetController.save);
/**
 * @openapi
 * /matches:
 *   post:
 *     tags: [Matches]
 *     summary: Crear un partido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatchRequest'
 *     responses:
 *       201:
 *         description: Partido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchResponse'
 */
router.post("/", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createMatchSchema), matchController.create);
/**
 * @openapi
 * /matches/{id}:
 *   put:
 *     tags: [Matches]
 *     summary: Actualizar partido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatchRequest'
 *     responses:
 *       200:
 *         description: Partido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchResponse'
 */
router.put("/:id", roleGuard(["ADMIN"]), validateSchema(updateMatchSchema), matchController.update);
/**
 * @openapi
 * /matches/{id}/status:
 *   put:
 *     tags: [Matches]
 *     summary: Actualizar estado de partido
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 */
router.put("/:id/status", matchController.updateStatus);
/**
 * @openapi
 * /matches/{id}:
 *   delete:
 *     tags: [Matches]
 *     summary: Eliminar partido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Partido eliminado
 */
router.delete("/:id", roleGuard(["ADMIN"]), matchController.delete);
/**
 * @openapi
 * /matches:
 *   get:
 *     tags: [Matches]
 *     summary: Listar partidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: tournamentId
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de partidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchListResponse'
 */
router.get("/", matchController.list);
/**
 * @openapi
 * /matches/{id}:
 *   get:
 *     tags: [Matches]
 *     summary: Obtener partido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Partido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MatchResponse'
 */
router.get("/:id", matchController.getById);
export default router;

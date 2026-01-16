import { Router } from "express";
import { tournamentController } from "./tournament.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createTournamentSchema, updateTournamentSchema, } from "./tournament.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
const router = Router();
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /tournaments:
 *   post:
 *     summary: Crear torneo
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTournamentRequest'
 *     responses:
 *       201:
 *         description: Torneo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post("/", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createTournamentSchema), tournamentController.create);
/**
 * @openapi
 * /tournaments/{id}:
 *   put:
 *     summary: Actualizar torneo
 *     tags: [Tournaments]
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
 *             $ref: '#/components/schemas/UpdateTournamentRequest'
 *     responses:
 *       200:
 *         description: Torneo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentResponse'
 *       404:
 *         description: Torneo no encontrado
 */
router.put("/:id", roleGuard(["ADMIN"]), validateSchema(updateTournamentSchema), tournamentController.update);
/**
 * @openapi
 * /tournaments/{id}:
 *   delete:
 *     summary: Eliminar torneo
 *     tags: [Tournaments]
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
 *         description: Torneo eliminado
 *       404:
 *         description: Torneo no encontrado
 */
router.delete("/:id", roleGuard(["ADMIN"]), tournamentController.delete);
/**
 * @openapi
 * /tournaments:
 *   get:
 *     summary: Listar torneos
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *       - name: active
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de torneos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentListResponse'
 */
router.get("/", tournamentController.list);
/**
 * @openapi
 * /tournaments/{id}:
 *   get:
 *     summary: Obtener torneo por ID
 *     tags: [Tournaments]
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
 *         description: Torneo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentResponse'
 *       404:
 *         description: Torneo no encontrado
 */
router.get("/:id", tournamentController.getById);
export default router;

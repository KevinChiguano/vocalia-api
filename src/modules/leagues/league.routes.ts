import { Router } from "express";
import { leagueController } from "./league.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import {
  createLeagueSchema,
  updateLeagueSchema,
} from "./league.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

/**
 * @openapi
 * /leagues:
 *   post:
 *     summary: Crear liga
 *     tags: [Leagues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeagueRequest'
 *     responses:
 *       201:
 *         description: Liga creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createLeagueSchema),
  leagueController.create
);

/**
 * @openapi
 * /leagues/{id}:
 *   put:
 *     summary: Actualizar liga
 *     tags: [Leagues]
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
 *             $ref: '#/components/schemas/UpdateLeagueRequest'
 *     responses:
 *       200:
 *         description: Liga actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueResponse'
 *       404:
 *         description: Liga no encontrada
 */
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateLeagueSchema),
  leagueController.update
);

/**
 * @openapi
 * /leagues/{id}:
 *   delete:
 *     summary: Eliminar liga
 *     tags: [Leagues]
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
 *         description: Liga eliminada
 *       404:
 *         description: Liga no encontrada
 */
router.delete("/:id", roleGuard(["ADMIN"]), leagueController.delete);

/**
 * @openapi
 * /leagues:
 *   get:
 *     summary: Listar ligas
 *     tags: [Leagues]
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
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de ligas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueListResponse'
 */
router.get("/", leagueController.list);

/**
 * @openapi
 * /leagues/{id}:
 *   get:
 *     summary: Obtener liga por ID
 *     tags: [Leagues]
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
 *         description: Liga encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeagueResponse'
 *       404:
 *         description: Liga no encontrada
 */
router.get("/:id", leagueController.getById);

export default router;

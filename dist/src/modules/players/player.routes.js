import { Router } from "express";
import { playerController } from "./player.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createPlayerSchema, updatePlayerSchema, bulkCreatePlayerSchema, } from "./player.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
const router = Router();
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /players:
 *   post:
 *     summary: Crear jugador
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlayerRequest'
 *     responses:
 *       201:
 *         description: Jugador creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post("/", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createPlayerSchema), playerController.create);
/**
 * @openapi
 * /players/bulk:
 *   post:
 *     summary: Importar jugadores masivamente
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CreatePlayerRequest'
 *     responses:
 *       201:
 *         description: Jugadores creados correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/bulk", strictLimiter, roleGuard(["ADMIN"]), validateSchema(bulkCreatePlayerSchema), playerController.bulkCreate);
/**
 * @openapi
 * /players/{dni}:
 *   put:
 *     summary: Actualizar jugador
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlayerRequest'
 *     responses:
 *       200:
 *         description: Jugador actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerResponse'
 *       404:
 *         description: Jugador no encontrado
 */
router.put("/:dni", roleGuard(["ADMIN"]), validateSchema(updatePlayerSchema), playerController.update);
/**
 * @openapi
 * /players/{dni}:
 *   delete:
 *     summary: Eliminar jugador
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jugador eliminado
 *       404:
 *         description: Jugador no encontrado
 */
router.delete("/:dni", roleGuard(["ADMIN"]), playerController.delete);
/**
 * @openapi
 * /players:
 *   get:
 *     summary: Listar jugadores
 *     tags: [Players]
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
 *         description: Lista de jugadores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerListResponse'
 */
router.get("/", playerController.list);
/**
 * @openapi
 * /players/{dni}:
 *   get:
 *     summary: Obtener jugador por DNI
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jugador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerResponse'
 *       404:
 *         description: Jugador no encontrado
 */
router.get("/:dni", playerController.getById);
export default router;

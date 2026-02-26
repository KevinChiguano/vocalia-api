import { Router } from "express";
import { teamController } from "./team.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createTeamSchema, updateTeamSchema, bulkCreateTeamSchema, } from "./team.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
const router = Router();
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /teams:
 *   post:
 *     summary: Crear equipo
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamRequest'
 *     responses:
 *       201:
 *         description: Equipo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post("/", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createTeamSchema), teamController.create);
/**
 * @openapi
 * /teams/bulk:
 *   post:
 *     summary: Importar equipos masivamente
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CreateTeamRequest'
 *     responses:
 *       201:
 *         description: Equipos importados correctamente
 *       400:
 *         description: Error en la importación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.post("/bulk", strictLimiter, roleGuard(["ADMIN"]), validateSchema(bulkCreateTeamSchema), teamController.bulkCreate);
/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     summary: Actualizar equipo
 *     tags: [Teams]
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
 *             $ref: '#/components/schemas/UpdateTeamRequest'
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamResponse'
 *       404:
 *         description: Equipo no encontrado
 */
router.put("/:id", roleGuard(["ADMIN"]), validateSchema(updateTeamSchema), teamController.update);
/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: Eliminar equipo
 *     tags: [Teams]
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
 *         description: Equipo eliminado
 *       404:
 *         description: Equipo no encontrado
 */
router.delete("/:id", roleGuard(["ADMIN"]), teamController.delete);
/**
 * @openapi
 * /teams:
 *   get:
 *     summary: Listar equipos
 *     tags: [Teams]
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
 *         description: Lista de equipos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamListResponse'
 */
router.get("/", teamController.list);
/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     summary: Obtener equipo por ID
 *     tags: [Teams]
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
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamResponse'
 *       404:
 *         description: Equipo no encontrado
 */
router.get("/:id", teamController.getById);
export default router;

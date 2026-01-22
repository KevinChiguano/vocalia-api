import { Router } from "express";
import { goalController } from "./goal.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createGoalSchema, updateGoalSchema } from "./goal.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
import { z } from "zod";
const router = Router();
const createGoalsBulkSchema = z.array(createGoalSchema);
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /goals:
 *   post:
 *     tags: [Goals]
 *     summary: Registrar un gol
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGoalRequest'
 *     responses:
 *       201:
 *         description: Gol registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalResponse'
 */
router.post("/", strictLimiter, roleGuard(["ADMIN", "VOCAL"]), validateSchema(createGoalSchema), goalController.create);
/**
 * @openapi
 * /goals/bulk:
 *   post:
 *     tags: [Goals]
 *     summary: Registrar múltiples goles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCreateGoalRequest'
 *     responses:
 *       201:
 *         description: Goles registrados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BulkCreateGoalResponse'
 */
router.post("/bulk", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createGoalsBulkSchema), goalController.bulkCreate);
/**
 * @openapi
 * /goals/{id}:
 *   put:
 *     tags: [Goals]
 *     summary: Actualizar gol
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
 *             $ref: '#/components/schemas/UpdateGoalRequest'
 *     responses:
 *       200:
 *         description: Gol actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalResponse'
 */
router.put("/:id", roleGuard(["ADMIN", "VOCAL"]), validateSchema(updateGoalSchema), goalController.update);
/**
 * @openapi
 * /goals/{id}:
 *   delete:
 *     tags: [Goals]
 *     summary: Eliminar gol
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
 *         description: Gol eliminado
 */
router.delete("/:id", roleGuard(["ADMIN", "VOCAL"]), goalController.delete);
/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [Goals]
 *     summary: Listar goles
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
 *         name: matchId
 *         schema:
 *           type: number
 *       - in: query
 *         name: playerId
 *         schema:
 *           type: number
 *       - in: query
 *         name: isOwnGoal
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de goles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalListResponse'
 */
router.get("/", goalController.list);
/**
 * @openapi
 * /goals/{id}:
 *   get:
 *     tags: [Goals]
 *     summary: Obtener gol por ID
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
 *         description: Gol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalResponse'
 */
router.get("/:id", goalController.getById);
export default router;

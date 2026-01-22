import { Router } from "express";
import { sanctionController } from "./sanction.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createSanctionSchema, updateSanctionSchema } from "./sanction.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
import { z } from "zod";
const router = Router();
// Definimos el esquema para la creación masiva (array de sanciones)
const createSanctionsBulkSchema = z.array(createSanctionSchema);
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /sanctions:
 *   post:
 *     tags: [Sanctions]
 *     summary: Crear una sanción
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSanctionRequest'
 *     responses:
 *       201:
 *         description: Sanción creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SanctionResponse'
 */
router.post("/", strictLimiter, roleGuard(["ADMIN", "VOCAL"]), validateSchema(createSanctionSchema), sanctionController.create);
/**
 * @openapi
 * /sanctions/bulk:
 *   post:
 *     tags: [Sanctions]
 *     summary: Crear sanciones de forma masiva
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCreateSanctionRequest'
 *     responses:
 *       201:
 *         description: Sanciones creadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/bulk", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createSanctionsBulkSchema), sanctionController.bulkCreate);
/**
 * @openapi
 * /sanctions/{id}:
 *   put:
 *     tags: [Sanctions]
 *     summary: Actualizar una sanción
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
 *             $ref: '#/components/schemas/UpdateSanctionRequest'
 *     responses:
 *       200:
 *         description: Sanción actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SanctionResponse'
 */
router.put("/:id", roleGuard(["ADMIN", "VOCAL"]), validateSchema(updateSanctionSchema), sanctionController.update);
/**
 * @openapi
 * /sanctions/{id}:
 *   delete:
 *     tags: [Sanctions]
 *     summary: Eliminar una sanción
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
 *         description: Sanción eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete("/:id", roleGuard(["ADMIN", "VOCAL"]), sanctionController.delete);
/**
 * @openapi
 * /sanctions:
 *   get:
 *     tags: [Sanctions]
 *     summary: Listar sanciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: matchId
 *         schema:
 *           type: number
 *       - in: query
 *         name: playerId
 *         schema:
 *           type: number
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/SanctionType'
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de sanciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SanctionListResponse'
 */
// Permite filtros: ?matchId=1&playerId=10&type=RED_CARD
router.get("/", sanctionController.list);
/**
 * @openapi
 * /sanctions/{id}:
 *   get:
 *     tags: [Sanctions]
 *     summary: Obtener una sanción por ID
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
 *         description: Sanción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SanctionResponse'
 */
router.get("/:id", sanctionController.getById);
export default router;

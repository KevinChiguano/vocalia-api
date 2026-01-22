import { Router } from "express";
import { substitutionController } from "./substitution.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createSubstitutionSchema, updateSubstitutionSchema, } from "./substitution.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";
import { z } from "zod";
const router = Router();
// Definimos el esquema para la creación masiva
const createSubstitutionsBulkSchema = z.array(createSubstitutionSchema);
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /substitutions:
 *   post:
 *     tags: [Substitutions]
 *     summary: Crear una sustitución
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubstitutionRequest'
 *     responses:
 *       201:
 *         description: Sustitución creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubstitutionResponse'
 */
router.post("/", strictLimiter, roleGuard(["ADMIN", "VOCAL"]), validateSchema(createSubstitutionSchema), substitutionController.create);
/**
 * @openapi
 * /substitutions/bulk:
 *   post:
 *     tags: [Substitutions]
 *     summary: Crear sustituciones de forma masiva
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCreateSubstitutionRequest'
 *     responses:
 *       201:
 *         description: Sustituciones creadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post("/bulk", strictLimiter, roleGuard(["ADMIN"]), validateSchema(createSubstitutionsBulkSchema), substitutionController.bulkCreate);
/**
 * @openapi
 * /substitutions/{id}:
 *   put:
 *     tags: [Substitutions]
 *     summary: Actualizar una sustitución
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
 *             $ref: '#/components/schemas/UpdateSubstitutionRequest'
 *     responses:
 *       200:
 *         description: Sustitución actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubstitutionResponse'
 */
router.put("/:id", roleGuard(["ADMIN", "VOCAL"]), validateSchema(updateSubstitutionSchema), substitutionController.update);
/**
 * @openapi
 * /substitutions/{id}:
 *   delete:
 *     tags: [Substitutions]
 *     summary: Eliminar una sustitución
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
 *         description: Sustitución eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete("/:id", roleGuard(["ADMIN", "VOCAL"]), substitutionController.delete);
/**
 * @openapi
 * /substitutions:
 *   get:
 *     tags: [Substitutions]
 *     summary: Listar sustituciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: matchId
 *         schema:
 *           type: number
 *       - in: query
 *         name: playerOut
 *         schema:
 *           type: number
 *       - in: query
 *         name: playerIn
 *         schema:
 *           type: number
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
 *         description: Lista de sustituciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubstitutionListResponse'
 */
router.get("/", substitutionController.list);
/**
 * @openapi
 * /substitutions/{id}:
 *   get:
 *     tags: [Substitutions]
 *     summary: Obtener una sustitución por ID
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
 *         description: Sustitución encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubstitutionResponse'
 */
router.get("/:id", substitutionController.getById);
export default router;

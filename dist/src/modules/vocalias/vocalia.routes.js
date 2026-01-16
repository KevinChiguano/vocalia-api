import { Router } from "express";
import { vocaliaController } from "./vocalia.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createVocaliaSchema, updateVocaliaSchema } from "./vocalia.schema";
const router = Router();
router.use(authMiddleware.verifyToken);
/**
 * @openapi
 * /vocalias:
 *   post:
 *     summary: Asignar un vocal a un partido
 *     tags: [Vocalias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVocaliaRequest'
 *     responses:
 *       201:
 *         description: Vocalía creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VocaliaResponse'
 *       409:
 *         description: El partido ya tiene vocal asignado
 */
router.post("/", roleGuard(["ADMIN"]), validateSchema(createVocaliaSchema), vocaliaController.create);
/**
 * @openapi
 * /vocalias/{matchId}:
 *   put:
 *     summary: Actualizar datos de la vocalía del partido
 *     tags: [Vocalias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVocaliaRequest'
 *     responses:
 *       200:
 *         description: Vocalía actualizada
 */
router.put("/:matchId", roleGuard(["VOCAL", "ADMIN"]), validateSchema(updateVocaliaSchema), vocaliaController.update);
/**
 * @openapi
 * /vocalias/{matchId}/finalize:
 *   post:
 *     summary: Finalizar un partido y actualizar la tabla de posiciones
 *     tags: [Vocalias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinalizeMatchRequest'
 *     responses:
 *       200:
 *         description: Partido finalizado correctamente
 */
router.post("/:matchId/finalize", roleGuard(["ADMIN"]), vocaliaController.finalize);
/**
 * @openapi
 * /vocalias/match/{matchId}:
 *   get:
 *     summary: Obtener la vocalía de un partido
 *     tags: [Vocalias]
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
 *         description: Vocalía del partido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VocaliaResponse'
 */
router.get("/match/:matchId", roleGuard(["ADMIN", "VOCAL"]), vocaliaController.getByMatch);
/**
 * @openapi
 * /vocalias/mine:
 *   get:
 *     summary: Listar vocalías asignadas al vocal autenticado
 *     tags: [Vocalias]
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
 *     responses:
 *       200:
 *         description: Lista de vocalías del vocal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VocaliaListResponse'
 */
router.get("/mine", roleGuard(["VOCAL"]), vocaliaController.listMine);
export default router;

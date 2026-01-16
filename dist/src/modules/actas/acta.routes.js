import { Router } from "express";
import { actaController } from "./acta.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
const router = Router();
/**
 * @openapi
 * /matches/{matchId}/acta:
 *   get:
 *     tags:
 *       - Actas
 *     summary: Obtener acta oficial del partido
 *     description: >
 *       Retorna el acta oficial consolidada de un partido finalizado.
 *       Incluye información del partido, vocalía, capitanes,
 *       planillas, eventos (goles, sanciones, sustituciones),
 *       datos administrativos y observaciones.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del partido
 *     responses:
 *       200:
 *         description: Acta del partido
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
 *                     match:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         category:
 *                           type: string
 *                         stage:
 *                           type: string
 *                         location:
 *                           type: string
 *                         score:
 *                           type: object
 *                           properties:
 *                             local:
 *                               type: number
 *                             away:
 *                               type: number
 *                         teams:
 *                           type: object
 *                           properties:
 *                             local:
 *                               type: string
 *                             away:
 *                               type: string
 *
 *                     vocal:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *
 *                     captains:
 *                       type: object
 *                       properties:
 *                         local:
 *                           type: string
 *                           nullable: true
 *                         away:
 *                           type: string
 *                           nullable: true
 *
 *                     planilla:
 *                       type: object
 *                       properties:
 *                         local:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               name:
 *                                 type: string
 *                               number:
 *                                 type: number
 *                               isStarting:
 *                                 type: boolean
 *                         away:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               name:
 *                                 type: string
 *                               number:
 *                                 type: number
 *                               isStarting:
 *                                 type: boolean
 *
 *                     events:
 *                       type: object
 *                       properties:
 *                         goals:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               time:
 *                                 type: string
 *                                 format: date-time
 *                               player:
 *                                 type: string
 *                               number:
 *                                 type: number
 *                               isOwnGoal:
 *                                 type: boolean
 *                         sanctions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               eventTime:
 *                                 type: string
 *                                 format: date-time
 *                               type:
 *                                 type: string
 *                               description:
 *                                 type: string
 *                               player:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                                   number:
 *                                     type: number
 *                         substitutions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               eventTime:
 *                                 type: string
 *                                 format: date-time
 *                               playerOut:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                                   number:
 *                                     type: number
 *                               playerIn:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: number
 *                                   name:
 *                                     type: string
 *                                   number:
 *                                     type: number
 *
 *                     administrative:
 *                       type: object
 *                       properties:
 *                         arbitrator:
 *                           type: string
 *                           nullable: true
 *                         totals:
 *                           type: object
 *                           properties:
 *                             local:
 *                               type: number
 *                             away:
 *                               type: number
 *                         signatures:
 *                           type: object
 *                           properties:
 *                             localCaptain:
 *                               type: string
 *                               nullable: true
 *                             awayCaptain:
 *                               type: string
 *                               nullable: true
 *
 *                     observations:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *
 *       400:
 *         description: ID de partido inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para acceder al acta
 *       404:
 *         description: El partido no existe, no ha finalizado o no tiene vocalía
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:matchId/acta", authMiddleware.verifyToken, roleGuard(["ADMIN", "VOCAL"]), actaController.getByMatch);
export default router;

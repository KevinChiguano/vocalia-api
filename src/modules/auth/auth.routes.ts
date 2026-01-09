import { Router } from "express";
import { authController } from "./auth.controller";
import { validateSchema } from "@/middlewares/validateSchema";
import { loginSchema } from "./auth.schema";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y retorna un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: Invalid credentials
 */

router.post("/login", validateSchema(loginSchema), authController.login);

router.get("/me", authMiddleware.verifyToken, authController.me);

export default router;

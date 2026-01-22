import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/role.guard";
import { validateSchema } from "@/middlewares/validateSchema";
import { createUserSchema, updateUserSchema } from "./user.schema";
import { strictLimiter } from "@/middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error de validación o email duplicado
 */
router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createUserSchema),
  userController.create,
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateUserSchema),
  userController.update,
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete("/:id", roleGuard(["ADMIN"]), userController.delete);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */
router.get("/", userController.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", userController.getById);

/**
 * @openapi
 * /users/roles:
 *   get:
 *     summary: Listar roles
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get("/roles", userController.getRoles);

/**
 * @openapi
 * /users/{id}/toggle-status:
 *   patch:
 *     summary: Alternar estado del usuario
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch(
  "/:id/toggle-status",
  roleGuard(["ADMIN"]),
  userController.toggleStatus,
);

export default router;

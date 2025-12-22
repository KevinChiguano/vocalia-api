import { Router } from "express";
import { substitutionController } from "./substitution.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import {
  createSubstitutionSchema,
  updateSubstitutionSchema,
} from "./substitution.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";
import { z } from "zod";

const router = Router();

// Definimos el esquema para la creación masiva
const createSubstitutionsBulkSchema = z.array(createSubstitutionSchema);

// Todas las rutas requieren token de autenticación
router.use(authMiddleware.verifyToken);

// Crear una sustitución (Solo ADMIN)
router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createSubstitutionSchema),
  substitutionController.create
);

// Crear sustituciones masivamente (Solo ADMIN)
router.post(
  "/bulk",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createSubstitutionsBulkSchema),
  substitutionController.bulkCreate
);

// Actualizar sustitución (Solo ADMIN)
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateSubstitutionSchema),
  substitutionController.update
);

// Eliminar sustitución (Solo ADMIN)
router.delete("/:id", roleGuard(["ADMIN"]), substitutionController.delete);

// Listar sustituciones (Cualquier usuario autenticado)
// Permite filtros: ?matchId=1&playerOut=10&playerIn=20
router.get("/", substitutionController.list);

// Obtener una sustitución por ID
router.get("/:id", substitutionController.getById);

export default router;

import { Router } from "express";
import { sanctionController } from "./sanction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createSanctionSchema, updateSanctionSchema } from "./sanction.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";
import { z } from "zod";

const router = Router();

// Definimos el esquema para la creación masiva (array de sanciones)
const createSanctionsBulkSchema = z.array(createSanctionSchema);

// Todas las rutas requieren token de autenticación
router.use(authMiddleware.verifyToken);

// Crear una sanción (Solo ADMIN)
router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createSanctionSchema),
  sanctionController.create
);

// Crear sanciones masivamente (Solo ADMIN)
router.post(
  "/bulk",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createSanctionsBulkSchema),
  sanctionController.bulkCreate
);

// Actualizar sanción (Solo ADMIN)
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateSanctionSchema),
  sanctionController.update
);

// Eliminar sanción (Solo ADMIN)
router.delete("/:id", roleGuard(["ADMIN"]), sanctionController.delete);

// Listar sanciones (Cualquier usuario autenticado)
// Permite filtros: ?matchId=1&playerId=10&type=RED_CARD
router.get("/", sanctionController.list);

// Obtener una sanción por ID
router.get("/:id", sanctionController.getById);

export default router;

import { Router } from "express";
import { regulationController } from "./regulation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";

const router = Router();

// Públicas/Usuarios Autenticados
router.get("/", authMiddleware.verifyToken, regulationController.getAllActive);

// Sólo Admin
router.get(
  "/admin",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN"]),
  regulationController.getAllAdmin,
);

router.post(
  "/",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN"]),
  regulationController.create,
);

router.get(
  "/:id",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN"]),
  regulationController.getById,
);

router.put(
  "/:id",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN"]),
  regulationController.update,
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  roleGuard(["ADMIN"]),
  regulationController.delete,
);

export default router;

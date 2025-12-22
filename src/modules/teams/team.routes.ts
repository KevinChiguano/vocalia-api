import { Router } from "express";
import { teamController } from "./team.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createTeamSchema, updateTeamSchema } from "./team.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createTeamSchema),
  teamController.create
);
router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateTeamSchema),
  teamController.update
);
router.delete("/:id", roleGuard(["ADMIN"]), teamController.delete);

router.get("/", teamController.list);
router.get("/:id", teamController.getById);

export default router;

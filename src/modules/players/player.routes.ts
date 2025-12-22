import { Router } from "express";
import { playerController } from "./player.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createPlayerSchema, updatePlayerSchema } from "./player.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createPlayerSchema),
  playerController.create
);

router.put(
  "/:dni",
  roleGuard(["ADMIN"]),
  validateSchema(updatePlayerSchema),
  playerController.update
);

router.delete("/:dni", roleGuard(["ADMIN"]), playerController.delete);

router.get("/", playerController.list);

router.get("/:dni", playerController.getById);

export default router;

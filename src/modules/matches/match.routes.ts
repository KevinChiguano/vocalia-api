import { Router } from "express";
import { matchController } from "./match.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createMatchSchema, updateMatchSchema } from "./match.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";

const router = Router();

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createMatchSchema),
  matchController.create
);

router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateMatchSchema),
  matchController.update
);

router.delete("/:id", roleGuard(["ADMIN"]), matchController.delete);

router.get("/", matchController.list);

router.get("/:id", matchController.getById);

export default router;

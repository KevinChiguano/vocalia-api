import { Router } from "express";
import { goalController } from "./goal.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";
import { validateSchema } from "../../middlewares/validateSchema";
import { createGoalSchema, updateGoalSchema } from "./goal.schema";
import { strictLimiter } from "../../middlewares/rateLimiter.middleware";
import { z } from "zod";

const router = Router();

const createGoalsBulkSchema = z.array(createGoalSchema);

router.use(authMiddleware.verifyToken);

router.post(
  "/",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createGoalSchema),
  goalController.create
);

router.post(
  "/bulk",
  strictLimiter,
  roleGuard(["ADMIN"]),
  validateSchema(createGoalsBulkSchema),
  goalController.bulkCreate
);

router.put(
  "/:id",
  roleGuard(["ADMIN"]),
  validateSchema(updateGoalSchema),
  goalController.update
);

router.delete("/:id", roleGuard(["ADMIN"]), goalController.delete);

router.get("/", goalController.list);

router.get("/:id", goalController.getById);

export default router;

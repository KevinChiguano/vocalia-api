
import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);
router.get("/:id", categoryController.getById);
router.get("/", categoryController.list);

export default router;

import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre de la categoría es requerido").max(100),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

import { z } from "zod";
const fieldBase = {
    name: z
        .string("El nombre es obligatorio")
        .min(1, "El nombre no puede estar vacío")
        .max(100, "El nombre es muy largo"),
    location: z.string().max(255, "La ubicación es muy larga").optional(),
    isActive: z.boolean().optional(),
};
export const createFieldSchema = z.object(fieldBase);
export const updateFieldSchema = z.object(fieldBase).partial();

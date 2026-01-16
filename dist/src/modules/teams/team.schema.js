import { z } from "zod";
const teamBase = {
    name: z
        .string()
        .min(3, "El nombre del equipo debe tener al menos 3 caracteres.")
        .max(100, "El nombre del equipo no puede superar los 100 caracteres."),
    logo: z
        .string()
        .url("El logo debe ser una URL válida.")
        .max(255, "La URL del logo no puede superar los 255 caracteres.")
        .optional(),
    categoryId: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
};
export const createTeamSchema = z.object(teamBase);
export const updateTeamSchema = z.object(teamBase).partial();

import { z } from "zod";

const leagueBase = {
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  imageUrl: z
    .string()
    .url("La URL de la imagen debe ser válida.")
    .or(z.literal(""))
    .optional(),

  isActive: z.boolean().optional(),
};

const baseSchema = z.object(leagueBase);

export const createLeagueSchema = baseSchema;
export const updateLeagueSchema = baseSchema.partial();

export type CreateLeagueInput = z.infer<typeof createLeagueSchema>;
export type UpdateLeagueInput = z.infer<typeof updateLeagueSchema>;

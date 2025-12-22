import { z } from "zod";

export const SanctionTypeEnum = z.enum([
  "amarilla",
  "roja_directa",
  "doble_amarilla",
]);

const sanctionBase = {
  matchId: z
    .number()
    .int("El ID del partido debe ser un número entero.")
    .positive("El ID del partido debe ser un número entero positivo."),

  playerId: z
    .number()
    .int("El ID del jugador debe ser un número entero.")
    .positive("El ID del jugador debe ser un número entero positivo."),

  type: SanctionTypeEnum.describe(
    "El tipo de sanción (ej: YELLOW_CARD, RED_CARD)."
  ),

  description: z
    .string({
      error: "La descripción debe ser una cadena de texto.",
    })
    .optional(),

  eventTime: z
    .string()
    .datetime(
      "El tiempo del evento debe ser una cadena de fecha y hora válida (ISO 8601)."
    ),
};

export const createSanctionSchema = z.object(sanctionBase);
export const updateSanctionSchema = z.object(sanctionBase).partial();

export type CreateSanctionInput = z.infer<typeof createSanctionSchema>;
export type UpdateSanctionInput = z.infer<typeof updateSanctionSchema>;

import { z } from "zod";

const playerBase = {
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(50, "El nombre no puede superar los 50 caracteres."),

  lastname: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres.")
    .max(50, "El apellido no puede superar los 50 caracteres.")
    .optional(),

  number: z
    .number()
    .int("El número debe ser un entero.")
    .min(1, "El número debe ser mayor que 0.")
    .max(99, "El número no puede superar el 99.")
    .optional(),

  dni: z
    .string()
    .regex(
      /^[0-9A-Z]{5,15}$/,
      "El DNI debe tener entre 5 y 15 caracteres alfanuméricos."
    )
    .min(5, "El DNI debe tener al menos 5 caracteres.")
    .max(15, "El DNI no puede superar los 15 caracteres."),

  teamId: z
    .number()
    .int("El ID del equipo debe ser un entero.")
    .positive("El ID del equipo debe ser positivo."),

  cardUrl: z.url("La URL de la tarjeta debe ser una URL válida.").optional(),

  birthDate: z.string().datetime({ offset: true }).optional().or(z.string().optional()), // Allow ISO string or just string for simplicity, verifying later

  categoryId: z.number().int().positive().optional(),

  isActive: z.boolean().optional(),
};

export const createPlayerSchema = z.object(playerBase);
export const updatePlayerSchema = z.object(playerBase).partial();

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;

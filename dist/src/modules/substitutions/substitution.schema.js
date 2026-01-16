import { z } from "zod";
const substitutionBase = {
    matchId: z
        .number()
        .int("El ID del partido debe ser un número entero.")
        .positive("El ID del partido debe ser un número entero positivo."),
    playerOut: z
        .number()
        .int("El ID del jugador que sale debe ser un número entero.")
        .positive("El ID del jugador que sale debe ser un número entero positivo."),
    playerIn: z
        .number()
        .int("El ID del jugador que entra debe ser un número entero.")
        .positive("El ID del jugador que entra debe ser un número entero positivo."),
    eventTime: z
        .string()
        .datetime("El tiempo del evento debe ser una cadena de fecha y hora válida (ISO 8601)."),
};
export const createSubstitutionSchema = z.object(substitutionBase);
export const updateSubstitutionSchema = z.object(substitutionBase).partial();

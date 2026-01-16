import { z } from "zod";
const goalBase = {
    matchId: z
        .number()
        .int("El ID del partido debe ser un número entero.")
        .positive("El ID del partido debe ser un número entero positivo."),
    playerId: z
        .number()
        .int("El ID del jugador debe ser un número entero.")
        .positive("El ID del jugador debe ser un número entero positivo."),
    eventTime: z
        .string()
        .datetime("El tiempo del evento debe ser una cadena de fecha y hora válida (ISO 8601)."),
    isOwnGoal: z.boolean().optional(),
};
export const createGoalSchema = z.object(goalBase);
export const updateGoalSchema = z.object(goalBase).partial();

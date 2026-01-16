import { z } from "zod";
const dateSchema = z
    .union([
    z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/, {
        // Valida tanto 'YYYY-MM-DD' como el formato ISO completo.
        message: "La fecha debe ser 'YYYY-MM-DD' o un formato ISO válido.",
    })
        // Transforma la cadena al formato de solo fecha 'YYYY-MM-DD'
        .transform((val) => val.substring(0, 10)),
    z.date(),
])
    .nullable()
    .optional();
const tournamentBase = {
    leagueId: z
        .number()
        .int()
        .positive("El ID de la liga debe ser un número positivo."),
    name: z
        .string()
        .min(5, "El nombre debe tener al menos 5 caracteres.")
        .max(100, "El nombre no puede superar los 100 caracteres."),
    startDate: dateSchema,
    endDate: dateSchema,
    isActive: z.boolean().optional(),
};
const baseSchema = z.object(tournamentBase);
const refinedSchema = baseSchema.refine((data) => {
    if (!data.startDate || !data.endDate)
        return true;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
        return false;
    return end >= start;
}, {
    message: "La fecha de finalización no puede ser menor que la fecha de inicio.",
    path: ["endDate"],
});
export const createTournamentSchema = refinedSchema;
export const updateTournamentSchema = refinedSchema.partial();

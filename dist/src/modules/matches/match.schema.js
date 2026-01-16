import { z } from "zod";
export const MatchStatus = z.enum([
    "programado",
    "en_curso",
    "finalizado",
    "suspendido",
    "cancelado",
]);
const matchBase = {
    tournamentId: z
        .number()
        .int("Debe ser un número entero.")
        .positive("Debe ser positivo."),
    localTeamId: z
        .number()
        .int("Debe ser un número entero.")
        .positive("Debe ser positivo."),
    awayTeamId: z
        .number()
        .int("Debe ser un número entero.")
        .positive("Debe ser positivo."),
    stage: z
        .string()
        .min(1, "La etapa es obligatoria.")
        .max(50, "La etapa no puede superar los 50 caracteres."),
    // Campos opcionales:
    category: z.string().max(50, "La categoría es muy larga.").optional(),
    matchDay: z.number().int("Debe ser un número entero.").optional(),
    matchDate: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date().optional()),
    location: z.string().max(100, "La ubicación es muy larga.").optional(),
    // Los scores son opcionales en el 'Create' si usas el default de Prisma
    localScore: z
        .number()
        .int()
        .min(0, "El puntaje local no puede ser negativo.")
        .optional(),
    awayScore: z
        .number()
        .int()
        .min(0, "El puntaje visitante no puede ser negativo.")
        .optional(),
    videoUrl: z.url("La URL del video debe ser una URL válida.").optional(),
    // El status es opcional en 'Create' ya que tiene un @default en Prisma
    status: MatchStatus.optional(),
};
export const createMatchSchema = z.object(matchBase);
export const updateMatchSchema = z.object(matchBase).partial();

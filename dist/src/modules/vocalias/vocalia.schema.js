import { z } from "zod";
const vocaliaBase = {
    localCaptainId: z.number().int().positive().optional().nullable(),
    awayCaptainId: z.number().int().positive().optional().nullable(),
    observations: z
        .string()
        .max(1000, "Las observaciones no pueden superar 1000 caracteres.")
        .optional()
        .nullable(),
    vocaliaData: z.record(z.string(), z.any()).optional().nullable(),
    arbitratorName: z.string().optional().nullable(),
    signatures: z.record(z.string(), z.string()).optional().nullable(),
};
export const createVocaliaSchema = z.object({
    matchId: z
        .number()
        .int("El ID del partido debe ser un número entero.")
        .positive("El ID del partido debe ser positivo."),
    vocalUserId: z
        .number()
        .int("El ID del vocal debe ser un número entero.")
        .positive("El ID del vocal debe ser positivo."),
});
export const updateVocaliaSchema = z.object(vocaliaBase).partial();

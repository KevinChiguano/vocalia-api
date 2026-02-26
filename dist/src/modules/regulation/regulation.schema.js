import { z } from "zod";
export const CreateRegulationSchema = z.object({
    article_num: z.string().min(1, "El número de artículo es obligatorio."),
    title: z.string().min(1, "El título es obligatorio."),
    description: z.string().min(1, "La descripción es obligatoria."),
    sanction: z.string().min(1, "La sanción es obligatoria."),
    badge_variant: z
        .enum([
        "primary",
        "warning",
        "danger",
        "info",
        "success",
        "neutral",
        "outline",
    ])
        .optional()
        .default("neutral"),
    category: z.string().min(1, "La categoría es obligatoria."),
});
export const UpdateRegulationSchema = CreateRegulationSchema.partial().extend({
    is_active: z.boolean().optional(),
});

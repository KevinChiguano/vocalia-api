import { z } from "zod";
const userBase = {
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(100, "El nombre no puede superar los 100 caracteres."),
    email: z
        .string()
        .email("El correo electrónico no es válido.")
        .max(150, "El correo electrónico no puede superar los 150 caracteres."),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
        .max(100, "La contraseña no puede superar los 100 caracteres."),
    rolId: z
        .number()
        .int("El rol debe ser un número entero.")
        .positive("El rol debe ser un número entero positivo."),
    isActive: z.boolean().optional(),
};
export const createUserSchema = z.object(userBase);
export const updateUserSchema = z.object(userBase).partial();

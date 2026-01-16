// import dotenv from "dotenv";
// dotenv.config();
// function requireEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     console.error(`FATAL ERROR: Environment variable ${name} is required.`);
//     process.exit(1);
//   }
//   return value;
// }
// export const env = {
//   PORT: process.env.PORT || "3000",
//   DATABASE_URL: requireEnv("DATABASE_URL"),
//   JWT_SECRET: requireEnv("JWT_SECRET"),
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
// };
import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
// Esquema fuerte con Zod
const envSchema = z.object({
    PORT: z.string().default("3000"),
    DATABASE_URL: z.string().url().optional(),
    JWT_SECRET: z.string().min(16, "JWT_SECRET debe tener mínimo 16 caracteres"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    // Configuración de Argon2
    ARGON_MEM: z
        .string()
        .optional()
        .transform((v) => Number(v ?? 65536))
        .refine((v) => v >= 4096, { message: "ARGON_MEM debe ser al menos 4096" }), // 64MB
    ARGON_TIME: z
        .string()
        .transform((v) => Number(v))
        .refine((v) => v >= 1, { message: "ARGON_TIME debe ser >= 1" })
        .default(3),
    ARGON_PARALLEL: z
        .string()
        .transform((v) => Number(v))
        .refine((v) => v >= 1, { message: "ARGON_PARALLEL debe ser >= 1" })
        .default(1),
    REDIS_HOST: z.string().default("127.0.0.1"),
    REDIS_PORT: z
        .string()
        .transform((v) => Number(v))
        .refine((v) => v > 0, { message: "REDIS_PORT debe ser un número positivo" })
        .default(6379),
});
// Parseo y validación
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("\n❌ ERROR: Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    if (process.env.NODE_ENV !== "test") {
        process.exit(1);
    }
    throw new Error("Invalid environment variables");
}
export const env = parsed.data;

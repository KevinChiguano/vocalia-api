import Redis from "ioredis";
import { env } from "./env";
// 🚀 Si existe REDIS_URL, ioredis se conecta usando esa cadena completa (Host, Port, User, Pass, y TLS automáticamente).
// Si no existe, usamos el objeto con host y port tradicionales (Local).
export const redis = env.REDIS_URL
    ? new Redis(env.REDIS_URL)
    : new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
    });
redis.on("connect", () => {
    console.log(`✅ Redis conectado (${env.REDIS_URL ? "Nube/Upstash" : "Local"})`);
});
redis.on("error", (err) => {
    console.error("❌ Redis error", err);
});

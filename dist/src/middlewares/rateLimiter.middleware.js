import { rateLimit } from "express-rate-limit";
// 1. Limitador Global (Para la mayoría de las rutas)
// Permite 100 peticiones en 15 minutos por IP.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 peticiones por `windowMs`
    standardHeaders: "draft-7", // Draft 7 de los headers del RateLimit
    legacyHeaders: false, // Deshabilita los headers X-RateLimit-*
    message: (req, res) => {
        // Respuesta personalizada cuando se supera el límite
        return res.status(429).json({
            status: "fail",
            message: "Demasiadas peticiones. Inténtalo de nuevo tras 15 minutos.",
        });
    },
});
// 2. Limitador Estricto (Para rutas de alto costo, como creación de usuario)
// Permite 5 peticiones en 5 minutos por IP.
export const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 20, // Limita cada IP a 20 peticiones por `windowMs`
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: (req, res) => {
        return res.status(429).json({
            status: "fail",
            message: "Límite de peticiones excedido para esta acción. Inténtalo de nuevo en 5 minutos.",
        });
    },
});

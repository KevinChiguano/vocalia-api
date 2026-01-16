// Nuevo errorHandler.ts
export const errorHandler = (err, req, res, next) => {
    console.error("Error global capturado:", err.stack);
    let statusCode = 500;
    let message = "Internal server error";
    // 💡 CLAVE: Detectar errores de JSON mal formado/Bad Request (que no son de Zod)
    if (err.type === "entity.parse.failed" ||
        err.status === 400 ||
        err.statusCode === 400) {
        statusCode = 400;
        message = "Bad Request: Invalid JSON or client input.";
    }
    else {
        message = err.message || "Internal server error";
    }
    // Si la respuesta ya se ha enviado, pasa al siguiente manejador de errores de Express
    if (res.headersSent) {
        return next(err);
    }
    return res
        .status(statusCode)
        .json({ success: false, message: message, error: err.message });
};

import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vocalia API",
      version: "1.0.0",
      description:
        "API para la gestión de torneos de fútbol, partidos, vocalías, goles y estadísticas.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: [
    "./src/modules/**/*.routes.ts",
    "src/modules/**/schema.ts",
    "./src/docs/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

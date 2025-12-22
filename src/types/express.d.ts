import { Request } from "express";

// Definir la estructura de los datos que van en el payload del JWT
export interface JwtPayload {
  id: number;
  email: string;
  rol: string;
}
// Extender la Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

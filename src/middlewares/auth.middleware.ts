import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types/express";

export const authMiddleware = {
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header)
      return res.status(401).json({ ok: false, message: "Token required" });

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET!) as JwtPayload;

      req.user = decoded;

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ ok: false, message: "Token expired" });
      }
      return res.status(401).json({ ok: false, message: "Invalid token" });
    }
  },
};

import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { fail } from "../utils/response";
export const authMiddleware = {
    verifyToken: (req, res, next) => {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json(fail("Token required"));
        }
        if (!header.startsWith("Bearer ")) {
            return res.status(401).json(fail("Invalid authorization format"));
        }
        const token = header.split(" ")[1];
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json(fail("Token expired"));
            }
            return res.status(401).json(fail("Invalid token"));
        }
    },
};

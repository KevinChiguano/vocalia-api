import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ok, fail } from "../../utils/response";

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result) return res.status(401).json(fail("Invalid credentials"));

    return res.json(ok(result));
  },
};

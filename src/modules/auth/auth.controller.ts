import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ok, fail } from "@/utils/response";

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result) return res.status(401).json(fail("Invalid credentials"));

    return res.json(ok(result));
  },
  me: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const userId = req.user.id;

    const user = await authService.me(userId);

    if (!user) {
      return res.status(401).json(fail("User not found"));
    }

    return res.json(ok(user));
  },
};

import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/middlewares/auth.middleware";

const mockReq = (token?: string) =>
  ({
    headers: token ? { authorization: `Bearer ${token}` } : {},
  } as any);

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn();
  return res;
};

const next = vi.fn();

describe("authMiddleware.verifyToken", () => {
  it("should return 401 if no token", () => {
    const req = mockReq();
    const res = mockRes();

    authMiddleware.verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should call next if token is valid", () => {
    vi.spyOn(jwt, "verify").mockReturnValue({ id: 1, rol: "ADMIN" } as any);

    const req = mockReq("valid-token");
    const res = mockRes();

    authMiddleware.verifyToken(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("invalid");
    });

    const req = mockReq("bad-token");
    const res = mockRes();

    authMiddleware.verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

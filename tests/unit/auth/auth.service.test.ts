import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/modules/auth/auth.service";
import prisma from "@/config/prisma";
import * as argon2 from "argon2";
import * as jwt from "@/utils/jwt";

// 🔴 Mocks
vi.mock("@/config/prisma", () => ({
  default: {
    users: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("argon2", () => ({
  verify: vi.fn(),
}));

vi.mock("@/utils/jwt", () => ({
  signToken: vi.fn(),
}));

describe("auth.service - login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe retornar null si el usuario no existe", async () => {
    (prisma.users.findUnique as any).mockResolvedValue(null);

    const result = await authService.login("test@mail.com", "123456");

    expect(result).toBeNull();
  });

  it("debe retornar null si el usuario está inactivo", async () => {
    (prisma.users.findUnique as any).mockResolvedValue({
      is_active: false,
    });

    const result = await authService.login("test@mail.com", "123456");

    expect(result).toBeNull();
  });

  it("debe retornar null si la contraseña es incorrecta", async () => {
    (prisma.users.findUnique as any).mockResolvedValue({
      user_id: 1,
      user_email: "test@mail.com",
      user_password: "hashed",
      user_name: "Kevin",
      is_active: true,
      roles: { rol_name: "ADMIN" },
    });

    (argon2.verify as any).mockResolvedValue(false);

    const result = await authService.login("test@mail.com", "badpass");

    expect(result).toBeNull();
  });

  it("debe retornar usuario y token si las credenciales son correctas", async () => {
    (prisma.users.findUnique as any).mockResolvedValue({
      user_id: 1,
      user_email: "test@mail.com",
      user_password: "hashed",
      user_name: "Kevin",
      is_active: true,
      roles: { rol_name: "ADMIN" },
    });

    (argon2.verify as any).mockResolvedValue(true);
    (jwt.signToken as any).mockReturnValue("fake-token");

    const result = await authService.login("test@mail.com", "123456");

    expect(result).toEqual({
      user: {
        id: 1,
        name: "Kevin",
        email: "test@mail.com",
        isActive: true,
        rol: "ADMIN",
      },
      token: "fake-token",
    });
  });
});

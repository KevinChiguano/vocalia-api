import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "@/modules/users/user.service";
import { userRepository } from "@/modules/users/user.repository";
import * as argon2 from "argon2";

vi.mock("@/modules/users/user.repository");
vi.mock("argon2");

describe("UserService.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lanza error si el email ya existe", async () => {
    userRepository.findUniqueByEmail = vi.fn().mockResolvedValue({});

    await expect(
      userService.create({
        name: "Test",
        email: "test@mail.com",
        password: "123456",
        rolId: 1,
      })
    ).rejects.toThrow("Email already in use");
  });

  it("crea un usuario correctamente", async () => {
    userRepository.findUniqueByEmail = vi.fn().mockResolvedValue(null);
    userRepository.create = vi.fn().mockResolvedValue({
      user_id: 1,
      user_name: "Test",
      user_email: "test@mail.com",
      is_active: true,
      roles: { rol_id: 1, rol_name: "ADMIN" },
    });

    (argon2.hash as any).mockResolvedValue("hashed-password");

    const result = await userService.create({
      name: "Test",
      email: "test@mail.com",
      password: "123456",
      rolId: 1,
    });

    expect(argon2.hash).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      name: "Test",
      email: "test@mail.com",
      isActive: true,
      roles: { id: 1, name: "ADMIN" },
    });
  });
});

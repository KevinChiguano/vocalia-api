process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-test";
process.env.JWT_EXPIRES_IN = "1h";

import { vi } from "vitest";

const { prismaMock } = vi.hoisted(() => {
  return {
    prismaMock: {
      tournament: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      team: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      player: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      match: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      goal: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      user: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      tournamentTeam: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        deleteMany: vi.fn(),
      },
      matchEvent: {
        create: vi.fn(),
        findMany: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    },
  };
});

vi.mock("@prisma/client", () => ({
  PrismaClient: class {
    constructor() {
      return prismaMock;
    }
  },
}));

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient: class {
    constructor() {
      return prismaMock;
    }
  },
}));

export { prismaMock };

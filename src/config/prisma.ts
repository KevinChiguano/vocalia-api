// import { PrismaClient } from "@prisma/client";
// // import { PrismaClient } from "../generated/prisma/client";
// export const prisma = new PrismaClient();

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida en el entorno.");
}

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// src/config/prisma.types.ts
import type { PrismaClient, Prisma } from "../generated/prisma/client";

// Alias claro para el transaction client que entrega prisma.$transaction
export type PrismaTx = Prisma.TransactionClient;

// Si quieres, también exporta el client type
export type PrismaClientType = PrismaClient;

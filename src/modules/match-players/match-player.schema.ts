// match-player.schema.ts
import { z } from "zod";

const matchPlayerBase = {
  matchId: z.number().int().positive(),
  teamId: z.number().int().positive(),
  playerId: z.number().int().positive(),
  isStarting: z.boolean().optional(),
};

export const createMatchPlayerSchema = z.object(matchPlayerBase);

export const bulkCreateMatchPlayerSchema = z.object({
  matchId: z.number().int().positive(),
  teamId: z.number().int().positive(),
  players: z
    .array(
      z.object({
        playerId: z.number().int().positive(),
        isStarting: z.boolean().optional(),
      })
    )
    .min(1, "Debe enviar al menos un jugador"),
});

export type CreateMatchPlayerInput = z.infer<typeof createMatchPlayerSchema>;
export type BulkCreateMatchPlayerInput = z.infer<
  typeof bulkCreateMatchPlayerSchema
>;

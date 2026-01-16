import { z } from "zod";
export const createTournamentTeamSchema = z.object({
    tournamentId: z.number().int().positive(),
    teamId: z.number().int().positive(),
    categoryId: z.number().int().positive().optional(),
});
export const updateTournamentTeamSchema = z.object({
    played: z.number().int().min(0).optional(),
    won: z.number().int().min(0).optional(),
    drawn: z.number().int().min(0).optional(),
    lost: z.number().int().min(0).optional(),
    goalsFor: z.number().int().min(0).optional(),
    goalsAgainst: z.number().int().min(0).optional(),
    points: z.number().int().min(0).optional(),
});

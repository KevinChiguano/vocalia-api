import prisma from "@/config/prisma";
import { CreateMatchInput } from "./match.schema";

export interface ProgrammingSheetRow {
  matchDate: Date;
  time: string; // e.g., "19:00"
  localTeamId: number;
  awayTeamId: number;
  category: string; // The category name
  vocalUserId: number;
  fieldId?: number;
}

export interface ProgrammingSheetInput {
  tournamentId: number;
  stage: string;
  matchDay: number;
  rows: ProgrammingSheetRow[];
}

export class ProgrammingSheetService {
  async saveSheet(data: ProgrammingSheetInput) {
    return prisma.$transaction(async (tx) => {
      const createdMatches = [];

      for (const row of data.rows) {
        // Construct match_date by combining row.matchDate and row.time
        const matchStartTime = new Date(row.matchDate);
        const [hours, minutes] = row.time.split(":").map(Number);
        matchStartTime.setHours(hours, minutes, 0, 0);

        // 1. Create Match
        const match = await tx.matches.create({
          data: {
            tournament_id: BigInt(data.tournamentId),
            local_team_id: BigInt(row.localTeamId),
            away_team_id: BigInt(row.awayTeamId),
            category: row.category,
            stage: data.stage,
            match_day: data.matchDay,
            match_date: matchStartTime,
            field_id: row.fieldId ? BigInt(row.fieldId) : null,
            status: "programado",
          },
        });

        // 2. Create Vocalia (Initialize)
        await tx.vocalias.create({
          data: {
            match_id: match.match_id,
            vocal_user_id: BigInt(row.vocalUserId),
            vocalia_data: {},
          },
        });

        createdMatches.push(match);
      }

      return {
        count: createdMatches.length,
        tournamentId: data.tournamentId,
      };
    });
  }
}

export const programmingSheetService = new ProgrammingSheetService();

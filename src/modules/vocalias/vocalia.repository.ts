import prisma from "@/config/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PrismaTx } from "@/config/prisma.types";

export const vocaliaSelectFields = {
  vocalia_id: true,
  match_id: true,
  vocal_user_id: true,
  local_captain_id: true,
  away_captain_id: true,
  observations: true,
  vocalia_data: true,
  created_at: true,
  match: {
    select: {
      match_id: true,
      status: true,
      local_score: true,
      away_score: true,
      match_date: true,
      match_day: true,
      stage: true,
      category: true,
      localTeam: {
        select: {
          team_id: true,
          team_name: true,
          team_logo: true,
        },
      },
      awayTeam: {
        select: {
          team_id: true,
          team_name: true,
          team_logo: true,
        },
      },
      field: {
        select: {
          field_id: true,
          name: true,
          location: true,
        },
      },
      tournament: {
        select: {
          tournament_id: true,
          name: true,
        },
      },
    },
  },
};

export class VocaliaRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findByMatchId(matchId: number, tx?: PrismaTx) {
    return this.getClient(tx).vocalias.findUnique({
      where: { match_id: BigInt(matchId) },
      select: vocaliaSelectFields,
    });
  }

  async findByMatchAndVocal(
    matchId: number,
    vocalUserId: number,
    tx?: PrismaTx,
  ) {
    return this.getClient(tx).vocalias.findFirst({
      where: {
        match_id: BigInt(matchId),
        vocal_user_id: BigInt(vocalUserId),
      },
      select: vocaliaSelectFields,
    });
  }

  async findMany(params: Prisma.vocaliasFindManyArgs, tx?: PrismaTx) {
    return this.getClient(tx).vocalias.findMany({
      ...params,
      select: params.select ?? vocaliaSelectFields,
    });
  }

  async create(data: Prisma.vocaliasUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).vocalias.create({
      data,
      select: vocaliaSelectFields,
    });
  }

  async update(
    matchId: number,
    data: Prisma.vocaliasUpdateInput,
    tx?: PrismaTx,
  ) {
    return this.getClient(tx).vocalias.update({
      where: { match_id: BigInt(matchId) },
      data,
      select: vocaliaSelectFields,
    });
  }

  async count(params: Prisma.vocaliasCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).vocalias.count(params);
  }
}

export const vocaliaRepository = new VocaliaRepository();

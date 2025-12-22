// tournament.repository.ts
import prisma from "../../config/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { PrismaTx } from "../../config/prisma.types";

export const tournamentSelectFields = {
  tournament_id: true,
  name: true,
  start_date: true,
  end_date: true,
  is_active: true,
  created_at: true,
};

export class TournamentRepository {
  private getClient(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  async findMany(params: Prisma.tournamentsFindManyArgs, tx?: PrismaTx) {
    const db = this.getClient(tx);

    return db.tournaments.findMany({
      ...params,
      select: params.select ?? tournamentSelectFields,
    });
  }

  async findById(id: number, tx?: PrismaTx) {
    const db = this.getClient(tx);
    return db.tournaments.findUnique({
      where: { tournament_id: id },
      select: tournamentSelectFields,
    });
  }

  async create(data: Prisma.tournamentsUncheckedCreateInput, tx?: PrismaTx) {
    return this.getClient(tx).tournaments.create({
      data,
      select: tournamentSelectFields,
    });
  }

  async update(id: number, data: Prisma.tournamentsUpdateInput, tx?: PrismaTx) {
    return this.getClient(tx).tournaments.update({
      where: { tournament_id: id },
      data,
      select: tournamentSelectFields,
    });
  }

  async delete(id: number, tx?: PrismaTx) {
    return this.getClient(tx).tournaments.delete({
      where: { tournament_id: id },
    });
  }

  async count(params: Prisma.tournamentsCountArgs, tx?: PrismaTx) {
    return this.getClient(tx).tournaments.count(params);
  }
}

export const tournamentRepository = new TournamentRepository();

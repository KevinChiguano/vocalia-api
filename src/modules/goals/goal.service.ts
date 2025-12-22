// goal.service.ts
import { goalRepository, goalSelectFields } from "./goal.repository";
import { CreateGoalInput, UpdateGoalInput } from "./goal.schema";
import { paginate } from "../../utils/pagination";
import { convertToEcuadorTime } from "../../utils/convert.time";
import type { PrismaTx } from "../../config/prisma.types";
import { invalidateStatsByMatch } from "../../utils/cache.stats";

const mapGoal = (g: any) => {
  if (!g) return null;

  return {
    id: g.goal_id,
    //: g.match_id,
    //playerId: g.player_id,
    eventTime: convertToEcuadorTime(g.event_time),
    isOwnGoal: g.is_own_goal,
    player: g.player && {
      id: g.player.player_id,
      name: g.player.player_name,
      lastName: g.player.player_lastname,
      dni: g.player.player_dni,
      number: g.player.player_number,
    },
    match: g.match && {
      id: g.match.match_id,
      localTeamId: g.match.local_team_id,
      awayTeamId: g.match.away_team_id,
      stage: g.match.stage,
      status: g.match.status,
    },
  };
};

export class GoalService {
  async create(data: CreateGoalInput, tx?: PrismaTx) {
    const created = await goalRepository.create(
      {
        match_id: BigInt(data.matchId),
        player_id: BigInt(data.playerId),
        event_time: new Date(data.eventTime),
        is_own_goal: data.isOwnGoal ?? false,
      },
      tx
    );

    if (!tx) {
      await invalidateStatsByMatch(data.matchId);
    }

    return mapGoal(created);
  }

  async createBulk(data: CreateGoalInput[], tx?: PrismaTx) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("El arreglo de goles está vacío.");
    }

    const payload = data.map((g) => ({
      match_id: BigInt(g.matchId),
      player_id: BigInt(g.playerId),
      event_time: new Date(g.eventTime),
      is_own_goal: g.isOwnGoal ?? false,
    }));

    const result = await goalRepository.createMany(payload, tx);

    if (!tx) {
      await invalidateStatsByMatch(data[0].matchId);
    }

    return {
      count: result.count,
      message: `Se registraron ${result.count} goles.`,
    };
  }

  async update(id: number, data: UpdateGoalInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.matchId !== undefined) updateData.match_id = BigInt(data.matchId);

    if (data.playerId !== undefined)
      updateData.player_id = BigInt(data.playerId);

    if (data.eventTime) updateData.event_time = new Date(data.eventTime);

    if (typeof data.isOwnGoal === "boolean")
      updateData.is_own_goal = data.isOwnGoal;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos para actualizar.");
    }

    const updated = await goalRepository.update(id, updateData, tx);
    return mapGoal(updated);
  }

  async delete(id: number, tx?: PrismaTx) {
    return goalRepository.delete(id, tx);
  }

  async getById(id: number, tx?: PrismaTx) {
    const g = await goalRepository.findById(id, tx);
    return mapGoal(g);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where: any = {};

    if (filter.match_id !== undefined) where.match_id = BigInt(filter.match_id);

    if (filter.player_id !== undefined)
      where.player_id = BigInt(filter.player_id);

    if (filter.is_own_goal !== undefined)
      where.is_own_goal = filter.is_own_goal;

    const result = await paginate(
      goalRepository,
      { page, limit },
      {
        where,
        orderBy: { goal_id: "desc" },
        select: goalSelectFields,
      },
      tx
    );

    return {
      items: result.items.map(mapGoal),
      pagination: result.pagination,
    };
  }

  async deleteByMatch(matchId: number, tx?: PrismaTx) {
    return goalRepository.deleteByMatchId(matchId, tx);
  }
}

export const goalService = new GoalService();

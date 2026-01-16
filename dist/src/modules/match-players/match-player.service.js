import { matchPlayerRepository } from "./match-player.repository";
import prisma from "@/config/prisma";
const mapMatchPlayerKeys = (mp) => {
    if (!mp)
        return null;
    return {
        id: mp.match_player_id,
        isStarting: mp.is_starting,
        player: mp.player
            ? {
                id: mp.player.player_id,
                name: `${mp.player.player_name} ${mp.player.player_lastname ?? ""}`.trim(),
                number: mp.player.player_number,
            }
            : null,
        team: mp.team
            ? {
                id: mp.team.team_id,
                name: mp.team.team_name,
            }
            : null,
    };
};
export class MatchPlayerService {
    async bulkCreate(data) {
        return prisma.$transaction(async (tx) => {
            // Limpia la planilla previa (si existe)
            await matchPlayerRepository.deleteByMatch(data.matchId, tx);
            const payload = data.players.map((p) => ({
                match_id: data.matchId,
                team_id: data.teamId,
                player_id: p.playerId,
                is_starting: p.isStarting ?? false,
            }));
            await matchPlayerRepository.createMany(payload, tx);
            return {
                matchId: data.matchId,
                totalPlayers: payload.length,
            };
        });
    }
    async listByMatch(matchId) {
        const list = await matchPlayerRepository.findByMatch(matchId);
        return list.map(mapMatchPlayerKeys);
    }
    async deleteByMatch(matchId) {
        const deleted = await matchPlayerRepository.deleteByMatch(matchId);
        return {
            deletedCount: deleted.count,
        };
    }
}
export const matchPlayerService = new MatchPlayerService();

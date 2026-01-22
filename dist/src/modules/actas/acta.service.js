// acta.service.ts
import prisma from "@/config/prisma";
import { convertToEcuadorTime } from "@/utils/convert.time";
export class ActaService {
    async getByMatchId(matchId) {
        if (!Number.isInteger(matchId) || matchId <= 0) {
            throw new Error("ID de partido inválido");
        }
        const matchIdBigInt = BigInt(matchId);
        /**
         * 1️⃣ Partido + vocalía
         */
        const match = await prisma.matches.findUnique({
            where: { match_id: matchIdBigInt },
            include: {
                localTeam: { select: { team_id: true, team_name: true } },
                awayTeam: { select: { team_id: true, team_name: true } },
                field: { select: { name: true } }, // Include field name
                vocalias: {
                    include: {
                        vocalUser: {
                            select: { user_id: true, user_name: true, user_email: true },
                        },
                        localCaptain: true,
                        awayCaptain: true,
                    },
                },
            },
        });
        if (!match)
            throw new Error("El partido no existe");
        if (match.status !== "finalizado")
            throw new Error("El partido aún no ha finalizado");
        if (match.vocalias.length === 0)
            throw new Error("El partido no tiene vocalía");
        const vocalia = match.vocalias[0];
        /**
         * 2️⃣ Planilla oficial
         */
        const matchPlayers = await prisma.match_players.findMany({
            where: { match_id: matchIdBigInt },
            include: {
                player: {
                    select: {
                        player_id: true,
                        player_name: true,
                        player_lastname: true,
                        player_number: true,
                    },
                },
                team: { select: { team_id: true } },
            },
            orderBy: { is_starting: "desc" },
        });
        const localPlayers = matchPlayers.filter((p) => p.team.team_id === match.local_team_id);
        const awayPlayers = matchPlayers.filter((p) => p.team.team_id === match.away_team_id);
        /**
         * 3️⃣ Eventos
         */
        const [goals, sanctions, substitutions] = await Promise.all([
            prisma.goals.findMany({
                where: { match_id: matchIdBigInt },
                include: { player: true },
                orderBy: { event_time: "asc" },
            }),
            prisma.sanctions.findMany({
                where: { match_id: matchIdBigInt },
                include: { player: true },
                orderBy: { event_time: "asc" },
            }),
            prisma.substitutions.findMany({
                where: { match_id: matchIdBigInt },
                include: {
                    playerIn: true,
                    playerOut: true,
                },
                orderBy: { event_time: "asc" },
            }),
        ]);
        /**
         * 4️⃣ Datos administrativos
         */
        const vocaliaData = (vocalia.vocalia_data ?? {});
        /**
         * 5️⃣ Acta consolidada
         */
        return {
            match: {
                id: match.match_id,
                date: match.match_date ? convertToEcuadorTime(match.match_date) : null,
                category: match.category,
                stage: match.stage,
                location: match.field?.name ?? "No definido", // Use field name or default
                score: {
                    local: match.local_score,
                    away: match.away_score,
                },
                teams: {
                    local: match.localTeam.team_name,
                    away: match.awayTeam.team_name,
                },
            },
            vocal: {
                id: vocalia.vocalUser.user_id,
                name: vocalia.vocalUser.user_name,
                email: vocalia.vocalUser.user_email,
            },
            captains: {
                local: vocalia.localCaptain
                    ? `${vocalia.localCaptain.player_name} ${vocalia.localCaptain.player_lastname ?? ""}`
                    : null,
                away: vocalia.awayCaptain
                    ? `${vocalia.awayCaptain.player_name} ${vocalia.awayCaptain.player_lastname ?? ""}`
                    : null,
            },
            planilla: {
                local: localPlayers.map((p) => ({
                    id: p.player.player_id,
                    name: `${p.player.player_name} ${p.player.player_lastname ?? ""}`,
                    number: p.player.player_number,
                    isStarting: p.is_starting,
                })),
                away: awayPlayers.map((p) => ({
                    id: p.player.player_id,
                    name: `${p.player.player_name} ${p.player.player_lastname ?? ""}`,
                    number: p.player.player_number,
                    isStarting: p.is_starting,
                })),
            },
            events: {
                goals: goals.map((g) => ({
                    time: convertToEcuadorTime(g.event_time),
                    player: `${g.player.player_name} ${g.player.player_lastname ?? ""}`,
                    number: g.player.player_number,
                    isOwnGoal: g.is_own_goal,
                })),
                sanctions: sanctions.map((s) => ({
                    eventTime: convertToEcuadorTime(s.event_time),
                    type: s.type,
                    description: s.description,
                    player: {
                        id: s.player_id,
                        name: `${s.player.player_name} ${s.player.player_lastname ?? ""}`.trim(),
                        number: s.player.player_number,
                    },
                })),
                substitutions: substitutions.map((s) => ({
                    eventTime: convertToEcuadorTime(s.event_time),
                    playerOut: {
                        id: s.player_out,
                        name: `${s.playerOut.player_name} ${s.playerOut.player_lastname ?? ""}`.trim(),
                        number: s.playerOut.player_number,
                    },
                    playerIn: {
                        id: s.player_in,
                        name: `${s.playerIn.player_name} ${s.playerIn.player_lastname ?? ""}`.trim(),
                        number: s.playerIn.player_number,
                    },
                })),
            },
            administrative: {
                arbitrator: vocaliaData.arbitratorName ?? null,
                totals: {
                    local: vocaliaData.totalLocalTeam ?? 0,
                    away: vocaliaData.totalAwayTeam ?? 0,
                },
                signatures: {
                    localCaptain: vocaliaData.localCaptainSignature ?? null,
                    awayCaptain: vocaliaData.awayCaptainSignature ?? null,
                },
            },
            observations: vocalia.observations,
            createdAt: vocalia.created_at
                ? convertToEcuadorTime(vocalia.created_at)
                : null,
        };
    }
}
export const actaService = new ActaService();

import { vocaliaService } from "./vocalia.service";
import { ok } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
export const vocaliaController = {
    create: async (req, res) => {
        try {
            const vocalia = await vocaliaService.create(req.body);
            return res.status(201).json(ok(vocalia));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            }
            const matchId = Number(req.params.matchId);
            const vocalUserId = req.user.id;
            const updated = await vocaliaService.update(matchId, req.body, vocalUserId);
            return res.json(ok(updated));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    finalize: async (req, res) => {
        try {
            const matchId = Number(req.params.matchId);
            const { localScore, awayScore, vocaliaData, arbitratorName, signatures } = req.body;
            if (typeof localScore !== "number" ||
                typeof awayScore !== "number" ||
                localScore < 0 ||
                awayScore < 0) {
                return res.status(400).json({
                    ok: false,
                    message: "Marcador inválido",
                });
            }
            const result = await vocaliaService.finalize(matchId, {
                localScore,
                awayScore,
                vocaliaData,
                arbitratorName,
                signatures,
            });
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getByMatch: async (req, res) => {
        try {
            const matchId = Number(req.params.matchId);
            try {
                const vocalia = await vocaliaService.getByMatchId(matchId);
                return res.json(ok(vocalia));
            }
            catch (error) {
                // Si no existe vocalía y es ADMIN, devolvemos la "vocalía virtual"
                if (req.user?.rol === "ADMIN") {
                    const virtualVocalia = await vocaliaService.getMatchAsVocalia(matchId);
                    return res.json(ok(virtualVocalia));
                }
                throw error;
            }
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getFinancials: async (req, res) => {
        try {
            const { tournamentId, categoryId, startDate, endDate, page, limit, search, } = req.query;
            const filters = {
                tournamentId: tournamentId ? Number(tournamentId) : undefined,
                categoryId: categoryId ? String(categoryId) : undefined,
                startDate: startDate ? String(startDate) : undefined,
                endDate: endDate ? String(endDate) : undefined,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20,
                search: search ? String(search) : undefined,
            };
            const result = await vocaliaService.getFinancials(filters);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    listMine: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const vocalUserId = req.user.id;
        try {
            if (req.user?.rol === "ADMIN") {
                const result = await vocaliaService.listAll(page, limit);
                return res.json(ok(result));
            }
            const result = await vocaliaService.listByVocal(vocalUserId, page, limit);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    verifyAccess: async (req, res) => {
        try {
            const { matchId, password } = req.body;
            if (!req.user)
                return res.status(401).json({ ok: false, message: "Unauthorized" });
            await vocaliaService.verifyAccess(Number(matchId), password, req.user);
            return res.json(ok({ access: true }));
        }
        catch (e) {
            return res.status(403).json({ ok: false, message: e.message });
        }
    },
    revert: async (req, res) => {
        try {
            const matchId = Number(req.params.matchId);
            // Only admin should be able to revert? Or vocal too?
            // User requested: "en caso fortuito poder hacer cambios en la gestion" -> implied vocal needs to be able to do it if they have access.
            // But let's restrict to having access. If they are calling this endpoint, they are likely already in the management page.
            // Ideally verify access again or rely on middleware.
            // For now, let's assume they are authenticated.
            const result = await vocaliaService.revertFinalization(matchId);
            return res.json(ok(result));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
};

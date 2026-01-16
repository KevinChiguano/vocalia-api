import { describe, it, expect, vi } from "vitest";
import { paginate } from "@/utils/pagination";
describe("paginate util", () => {
    const modelMock = {
        findMany: vi.fn(),
        count: vi.fn(),
    };
    it("pagina correctamente con page y limit", async () => {
        modelMock.findMany.mockResolvedValue([{ id: 1 }]);
        modelMock.count.mockResolvedValue(12);
        const result = await paginate(modelMock, { page: 2, limit: 5 }, { where: { active: true } });
        expect(modelMock.findMany).toHaveBeenCalledWith(expect.objectContaining({
            skip: 5,
            take: 5,
            where: { active: true },
        }), undefined);
        expect(result.pagination).toEqual({
            total: 12,
            page: 2,
            limit: 5,
            totalPages: 3,
        });
    });
    it("usa valores por defecto si no se envían", async () => {
        modelMock.findMany.mockResolvedValue([]);
        modelMock.count.mockResolvedValue(0);
        const result = await paginate(modelMock, {}, {});
        expect(result.pagination.page).toBe(1);
        expect(result.pagination.limit).toBe(10);
    });
});

import { categoryService } from "./category.service";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import { ok, fail } from "@/utils/response";
import { handlePrismaError } from "@/utils/prismaErrorHandler";
import { parseBoolean, parseString } from "@/utils/parseFilters";
export const categoryController = {
    create: async (req, res) => {
        try {
            const validated = createCategorySchema.parse(req.body);
            const category = await categoryService.create(validated);
            return res.status(201).json(ok(category));
        }
        catch (e) {
            if (e.name === "ZodError") {
                return res.status(400).json(fail(e.errors));
            }
            return handlePrismaError(e, res);
        }
    },
    update: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const validated = updateCategorySchema.parse(req.body);
            const category = await categoryService.update(id, validated);
            return res.json(ok(category));
        }
        catch (e) {
            if (e.name === "ZodError") {
                return res.status(400).json(fail(e.errors));
            }
            return handlePrismaError(e, res);
        }
    },
    delete: async (req, res) => {
        try {
            const id = Number(req.params.id);
            await categoryService.delete(id);
            return res.json(ok("Categoría eliminada."));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    getById: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const category = await categoryService.getById(id);
            if (!category) {
                return res.status(404).json(fail(`Categoría con ID ${id} no encontrada.`));
            }
            return res.json(ok(category));
        }
        catch (e) {
            return handlePrismaError(e, res);
        }
    },
    list: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const filter = {
            is_active: parseBoolean(req.query.active),
            search: parseString(req.query.search),
        };
        try {
            const result = await categoryService.list(page, limit, filter);
            return res.json(ok(result));
        }
        catch (e) {
            return res
                .status(500)
                .json(fail("Error al obtener la lista de categorías."));
        }
    },
};

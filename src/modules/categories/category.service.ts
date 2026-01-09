
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { convertToEcuadorTime } from "@/utils/convert.time";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import { paginate } from "@/utils/pagination";
import { categoryRepository, categorySelectFields } from "./category.repository";
import type { PrismaTx } from "@/config/prisma.types";
import {
  buildSearchFilter,
  buildBooleanFilter,
} from "@/utils/filter.builder";
import { z } from "zod";

type CreateCategoryInput = z.infer<typeof createCategorySchema>;
type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

const mapCategoryKeys = (category: any) => {
  if (!category) return null;

  return {
    id: category.category_id,
    name: category.name,
    description: category.description,
    isActive: category.is_active,
    createdAt: convertToEcuadorTime(category.created_at),
    updatedAt: category.updated_at ? convertToEcuadorTime(category.updated_at) : null,
  };
};

export class CategoryService {
  async create(data: CreateCategoryInput, tx?: PrismaTx) {
    const newCategory = await categoryRepository.create(
      {
        name: data.name,
        description: data.description,
        is_active: data.is_active ?? true,
      },
      tx
    );

    return mapCategoryKeys(newCategory);
  }

  async update(id: number, data: UpdateCategoryInput, tx?: PrismaTx) {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (typeof data.is_active === "boolean")
      updateData.is_active = data.is_active;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No hay datos válidos para actualizar.");
    }

    try {
      const updatedCategory = await categoryRepository.update(id, updateData, tx);
      return mapCategoryKeys(updatedCategory);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(`La categoría con ID ${id} no existe.`);
      }
      throw e;
    }
  }

  async delete(id: number, tx?: PrismaTx) {
    try {
      // Soft delete implementation as per pattern seen in controller earlier comment,
      // but Repository had hard delete.
      // However, usually we want soft delete.
      // Let's do soft delete here if the model supports it (it does: is_active).
      // But wait, TeamService.delete calls Repository.delete.
      // If TeamRepository.delete is a hard delete, then TeamService does hard delete.
      // Let's check TeamRepository.delete again.
      // It was: return this.getClient(tx).teams.delete(...) which is hard delete.
      // So I will stick to hard delete for consistency, or soft delete if 'Active' is the toggle.
      // The user prompt said "should function correctly".
      // I'll stick to hard delete to match TeamService.
      await categoryRepository.delete(id, tx);
      return "Categoría eliminada";
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
        throw new Error(
          `La categoría con ID ${id} no fue encontrada para borrar.`
        );
      }
      throw e;
    }
  }

  async getById(id: number, tx?: PrismaTx) {
    const category = await categoryRepository.findById(id, tx);
    return mapCategoryKeys(category);
  }

  async list(page: number, limit: number, filter: any, tx?: PrismaTx) {
    const where: any = {};

    Object.assign(
      where,
      buildBooleanFilter("is_active", filter.is_active),
      buildSearchFilter(filter.search, ["name", "description"])
    );

    const result = await paginate(
      categoryRepository,
      { page, limit },
      {
        where,
        select: categorySelectFields,
        orderBy: { category_id: "desc" },
      },
      tx
    );

    return {
      items: result.items.map(mapCategoryKeys),
      pagination: result.pagination,
    };
  }
}

export const categoryService = new CategoryService();

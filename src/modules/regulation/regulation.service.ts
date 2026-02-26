import prisma from "../../config/prisma";
import { CreateRegulationDTO, UpdateRegulationDTO } from "./regulation.schema";

export const regulationService = {
  async getAllActive() {
    return await prisma.regulation_articles.findMany({
      where: { is_active: true },
      orderBy: { created_at: "asc" },
    });
  },

  async getAllAdmin() {
    return await prisma.regulation_articles.findMany({
      orderBy: { created_at: "asc" },
    });
  },

  async getById(id: bigint) {
    return await prisma.regulation_articles.findUnique({
      where: { article_id: id },
    });
  },

  async create(data: CreateRegulationDTO) {
    return await prisma.regulation_articles.create({
      data: {
        article_num: data.article_num,
        title: data.title,
        description: data.description,
        sanction: data.sanction,
        category: data.category,
        badge_variant: data.badge_variant,
      },
    });
  },

  async update(id: bigint, data: UpdateRegulationDTO) {
    return await prisma.regulation_articles.update({
      where: { article_id: id },
      data,
    });
  },

  async delete(id: bigint) {
    return await prisma.regulation_articles.delete({
      where: { article_id: id },
    });
  },

  async toggleActive(id: bigint, isActive: boolean) {
    return await prisma.regulation_articles.update({
      where: { article_id: id },
      data: { is_active: isActive },
    });
  },
};

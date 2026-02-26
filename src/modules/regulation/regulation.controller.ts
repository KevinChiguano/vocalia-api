import { Request, Response } from "express";
import { regulationService } from "./regulation.service";
import {
  CreateRegulationSchema,
  UpdateRegulationSchema,
} from "./regulation.schema";
import { normalizeBigInt } from "../../utils/normalizeBigInt";

export const regulationController = {
  async getAllActive(req: Request, res: Response) {
    try {
      const articles = await regulationService.getAllActive();
      res.json(normalizeBigInt(articles));
    } catch (error) {
      console.error("[Regulation] Error in getAllActive", error);
      res.status(500).json({ error: "Error fetching regulation articles" });
    }
  },

  async getAllAdmin(req: Request, res: Response) {
    try {
      const articles = await regulationService.getAllAdmin();
      res.json(normalizeBigInt(articles));
    } catch (error) {
      console.error("[Regulation] Error in getAllAdmin", error);
      res
        .status(500)
        .json({ error: "Error fetching regulation articles for admin" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const article = await regulationService.getById(BigInt(id));
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json(normalizeBigInt(article));
    } catch (error) {
      console.error("[Regulation] Error in getById", error);
      res.status(500).json({ error: "Error fetching regulation article" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const parsedData = CreateRegulationSchema.parse(req.body);
      const article = await regulationService.create(parsedData);
      res.status(201).json(normalizeBigInt(article));
    } catch (error: any) {
      console.error("[Regulation] Validation/Creation error", error);
      if (error.errors) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Error creating regulation article" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedData = UpdateRegulationSchema.parse(req.body);
      const article = await regulationService.update(BigInt(id), parsedData);
      res.json(normalizeBigInt(article));
    } catch (error: any) {
      console.error("[Regulation] Validation/Update error", error);
      if (error.errors) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Error updating regulation article" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await regulationService.delete(BigInt(id));
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("[Regulation] Error deleting article", error);
      res.status(500).json({ error: "Error deleting regulation article" });
    }
  },
};

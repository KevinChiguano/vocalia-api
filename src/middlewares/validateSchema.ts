// middlewares/validateSchema.ts

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { fail } from "../utils/response";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(
      //   `Validating body for ${req.method} ${req.originalUrl}:`,
      //   JSON.stringify(req.body, null, 2)
      // );
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(
          `Validation failed for ${req.method} ${req.originalUrl}:`,
          JSON.stringify(error.issues, null, 2)
        );
        return res.status(400).json(fail(error.issues));
      }

      console.error(
        `Internal validation error for ${req.method} ${req.originalUrl}:`,
        error
      );
      return res
        .status(500)
        .json(fail("Internal Server Error during validation"));
    }
  };

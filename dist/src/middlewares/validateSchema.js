// middlewares/validateSchema.ts
import { ZodError } from "zod";
import { fail } from "../utils/response";
export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json(fail(error.issues));
        }
        return res
            .status(500)
            .json(fail("Internal Server Error during validation"));
    }
};

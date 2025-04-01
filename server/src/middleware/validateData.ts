import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "../utils/httpStatusCodes.js";

type UserReqInput = Partial<
    Record<"params" | "query" | "body" | "files", z.ZodType<any>>
>;

export const validateData = (schemaMapping: UserReqInput) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const validationErrors = [];
        for (const [key, schema] of Object.entries(schemaMapping)) {
            try {
                const data = req[key as keyof UserReqInput] as UserReqInput;
                schema.parse(data);
            } catch (error) {
                if (error instanceof ZodError) {
                    for (const err of error.errors) {
                        const message = `${key}${err.path.length > 0 ? "." : ""}${err.path.join(".")}: ${err.message}`;
                        validationErrors.push(message);
                    }
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        msg: "An unexpected error occurred during validation.",
                    });
                    return;
                }
            }
        }

        if (validationErrors.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                msg: validationErrors.join("\n"),
            });
            return;
        }

        next();
    };
};

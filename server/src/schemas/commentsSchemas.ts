import { z } from "zod";
import { mongooseZodObject } from "../utils/mongoose.type.js";

export const commentsGetAllParamsSchema = z
    .object({
        articleId: mongooseZodObject,
    })
    .strict();

export const commentsCreateParamsSchema = commentsGetAllParamsSchema;

export const commentsCreateBodySchema = z
    .object({
        message: z.string().min(1),
        parentId: mongooseZodObject.nullable(),
    })
    .strict();

export const commentsUpdateParamsSchema = z
    .object({
        id: mongooseZodObject,
        articleId: mongooseZodObject,
    })
    .strict();

export const commentsUpdateQuerySchema = z
    .object({
        authorId: mongooseZodObject,
    })
    .strict();

export const commentsUpdateBodySchema = z
    .object({
        message: z.string().min(1),
    })
    .strict();

export const commentsDeleteParamsSchema = commentsUpdateParamsSchema;
export const commentsDeleteQuerySchema = commentsUpdateQuerySchema;

export const commentsDeleteManyParamsSchema = commentsDeleteParamsSchema;
export const commentsDeleteManyQuerySchema = commentsDeleteQuerySchema;

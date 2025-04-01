import { z } from "zod";
import { mongooseZodObject } from "../utils/mongoose.type.js";

export const articleGetSingleParamsSchema = z
    .object({
        id: mongooseZodObject,
    })
    .strict();

export const articleCreateBodySchema = z
    .object({
        title: z.string().max(100),
        slug: z.string().max(100),
        content: z.string().min(10),
        html: z.string().min(10),
        category: z.enum(["blog", "projects"]),
        source_link: z.string().optional(),
        demo_link: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string(),
        img_id: z.string(),
    })
    .strict();

export const articleUpdateBodySchema = articleCreateBodySchema.extend({
    userId: mongooseZodObject,
});

export const articleUpdateParamsSchema = z
    .object({
        id: mongooseZodObject,
    })
    .strict();

export const articleDeleteParamsSchema = articleUpdateParamsSchema;

export const uploadedArticleImageFileSchema = z.object({
    image: z.object({
        name: z.string().min(1),
        mimetype: z.string().regex(/^image\/(jpeg|png|gif|webp)$/),
        size: z.number().max(10 * 1024 * 1024), // 10MB
        data: z.instanceof(Buffer),
        tempFilePath: z.string().min(1),
        encoding: z.string(),
    }),
});

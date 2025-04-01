import { z } from "zod";
import { mongooseZodObject } from "../utils/mongoose.type.js";

export const userBanParamsSchema = z
    .object({
        id: mongooseZodObject,
    })
    .strict();

import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { z } from "zod";

export type MongooseDocument<T> = mongoose.Document<unknown, object, T> &
    T &
    Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };

export const mongooseZodObject = z
    .string()
    .refine((val) => ObjectId.isValid(val), {
        message: "id must be a valid MongoDB ObjectId",
    });

import mongoose from "mongoose";

export type MongooseDocument<T> = mongoose.Document<unknown, object, T> &
    T &
    Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    };

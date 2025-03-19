import mongoose from "mongoose";

export const connectDB = (url: string): Promise<typeof mongoose> => {
    mongoose.set("strictQuery", false);
    return mongoose.connect(url);
};

import mongoose from "mongoose";

export const connectDB = (url: string): Promise<typeof mongoose> => {
    mongoose.set("strict", "throw");
    mongoose.set("strictQuery", "throw");
    return mongoose.connect(url);
};

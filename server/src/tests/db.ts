import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongodb: MongoMemoryServer;

export const connect = async (): Promise<void> => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {});
};

export const closeDatabase = async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
};

export const clearDatabase = async (): Promise<void> => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection?.deleteMany({});
    }
};

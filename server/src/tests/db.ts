import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongodb: MongoMemoryServer;

export const connect = async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {});
};
/**
 * Close db connection
 */
export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
};

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

import { createClient } from "redis";

const getRedisClient = () => {
    const redisClient = createClient();
    redisClient.on("error", (error) => {
        console.error(error);
        process.exit(1);
    });
    return redisClient;
};

export const redisClient = getRedisClient();

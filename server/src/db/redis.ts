import { createClient } from "redis";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getRedisClient = () => {
    const redisClient = createClient();
    redisClient.on("error", (error) => {
        console.error(error);
        process.exit(1);
    });
    return redisClient;
};

export const redisClient = getRedisClient();

import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (error) => {
    console.error(error);
    process.exit(1);
});

export { redisClient };

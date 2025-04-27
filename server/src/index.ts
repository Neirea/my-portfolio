import app from "./app.js";
import { connectDB } from "./db/connect.js";
import { redisClient } from "./db/redis.js";
import { appConfig } from "./utils/appConfig.js";

const start = async (): Promise<void> => {
    try {
        await connectDB(appConfig.mongoUrl!);
        await redisClient.connect();
        if (appConfig.nodeEnv !== "production") {
            app.listen(appConfig.port, () =>
                console.log(`Server is listening on port ${appConfig.port}...`),
            );
        } else {
            app.listen(appConfig.port, "0.0.0.0");
        }
    } catch (error) {
        console.error(error);
    }
};

void start();

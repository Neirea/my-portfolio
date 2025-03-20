import app from "./app.js";
import { connectDB } from "./db/connect.js";
import { redisClient } from "./db/redis.js";

const port = process.env.PORT || 5000;

const start = async (): Promise<void> => {
    try {
        await connectDB(process.env.MONGO_URL || "");
        await redisClient.connect();
        if (process.env.NODE_ENV !== "production") {
            app.listen(port, () =>
                console.log(`Server is listening on port ${port}...`),
            );
        } else {
            app.listen(8080, "0.0.0.0");
        }
    } catch (error) {
        console.error(error);
    }
};

void start();

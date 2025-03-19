import "express-async-errors";

import express from "express";
import { v2 as cloudinary } from "cloudinary";
import MongoStore from "connect-mongo";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "./middleware/rateLimit";
import { RateLimiter } from "rate-limiter-algorithms";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import passport from "passport";

import "./passport";
import errorHandlerMiddleware from "./middleware/errorHandle";
import notFoundMiddleware from "./middleware/notFound";
import actionRouter from "./routes/actionRouter";
import articleRouter from "./routes/articleRouter";
import authRouter from "./routes/authRouter";
import commentRouter from "./routes/commentRouter";
import userRouter from "./routes/userRouter";

const app = express();

cloudinary.config({
    cloud_name: process.env.CLDNRY_NAME,
    api_key: process.env.CLDNRY_API_KEY,
    api_secret: process.env.CLDNRY_API_SECRET,
});

const limiter = new RateLimiter({
    algorithm: "token-bucket",
    windowMs: 1_000,
    limit: 50,
});

app.set("trust proxy", 1);
app.use(rateLimit(limiter));
app.use(helmet());
app.use(
    cors({
        origin:
            process.env.NODE_ENV !== "production"
                ? ["http://localhost:4173", "http://localhost:5173"]
                : "https://www.neirea.com",
        credentials: true,
    }),
);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(buildCheckFunction(["body", "query", "params"])());

if (process.env.NODE_ENV === "development") {
    import("morgan")
        .then(({ default: morgan }) => {
            app.use(morgan("tiny"));
        })
        .catch((err) => {
            console.error("Failed to load morgan:", err);
        });
}
if (process.env.NODE_ENV !== "test") {
    const sessionStore = new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        collectionName: "sessions",
    });
    app.use(
        session({
            secret: process.env.SESSION_SECRET!,
            name: "s_id",
            saveUninitialized: false,
            resave: false,
            store: sessionStore,
            cookie: {
                httpOnly: true,
                domain:
                    process.env.NODE_ENV === "production"
                        ? "neirea.com"
                        : undefined,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
                sameSite:
                    process.env.NODE_ENV === "production" ? true : undefined,
            },
        }),
    );
}

app.use(passport.initialize());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/comment", commentRouter);
app.use("/api/action", actionRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

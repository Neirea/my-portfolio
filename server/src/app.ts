import "express-async-errors";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import MongoStore from "connect-mongo";
import cors from "cors";
import fileUpload from "express-fileupload";
import rateLimit from "./middleware/rateLimit.js";
import { RateLimiter } from "rate-limiter-algorithms";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import morgan from "morgan";

import "./passport.js";
import errorHandlerMiddleware from "./middleware/errorHandle.js";
import notFoundMiddleware from "./middleware/notFound.js";
import actionRouter from "./routes/actionRouter.js";
import articleRouter from "./routes/articleRouter.js";
import authRouter from "./routes/authRouter.js";
import commentRouter from "./routes/commentRouter.js";
import userRouter from "./routes/userRouter.js";
import { appConfig } from "./utils/appConfig.js";

const app = express();

cloudinary.config({
    cloud_name: appConfig.cloudinaryName,
    api_key: appConfig.cloudinaryAPIKey,
    api_secret: appConfig.cloudinaryAPISecret,
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
        origin: appConfig.clientUrl,
        credentials: true,
    }),
);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());

if (appConfig.nodeEnv === "development" || !appConfig.nodeEnv) {
    app.use(morgan("tiny"));
}
if (appConfig.nodeEnv !== "test") {
    const sessionStore = new MongoStore({
        mongoUrl: appConfig.mongoUrl,
        collectionName: "sessions",
    });
    app.use(
        session({
            secret: appConfig.sessionSecret!,
            name: "s_id",
            saveUninitialized: false,
            resave: false,
            store: sessionStore,
            cookie: {
                httpOnly: true,
                domain: appConfig.domain,
                secure: appConfig.nodeEnv === "production",
                maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
                sameSite: appConfig.nodeEnv === "production",
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

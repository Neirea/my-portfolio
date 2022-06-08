require("express-async-errors"); // see if it works
import express from "express";
//packages
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
/* user stuff */
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import articleRouter from "./routes/articleRouter";
import actionRouter from "./routes/actionRouter";
import commentRouter from "./routes/commentRouter";
import errorHandlerMiddleware from "./middleware/error-handle";
import notFoundMiddleware from "./middleware/not-found";
import { sessionStore } from "./config";

const app = express();
/* routers */

/* middleware */
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 60 * 1000, max: 50 })); //set numbers that fit best and check if needed in production
app.use(helmet());
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? process.env.PRODUCTION_URL
				: "http://localhost:3000",
	})
);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));
//add csrf middleware from csurf?

if (process.env.NODE_ENV !== "production") {
	const morgan = require("morgan");
	app.use(morgan("tiny"));
}

/* session middleware */
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		name: "sid",
		saveUninitialized: false, // don't create session until something stored
		resave: false, //don't save session if unmodified
		store: sessionStore,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
		},
	})
);
import "./passportStrategies"; //use passport strategies
app.use(passport.initialize()); //passport init

/* use routers */
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/comment", commentRouter);
app.use("/api/action", actionRouter);

/* error middleware */
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;

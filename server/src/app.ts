import "express-async-errors";
import express from "express";
//packages
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import passport from "passport";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { buildCheckFunction } from "express-validator";
import MongoStore from "connect-mongo";
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLDNRY_NAME,
	api_key: process.env.CLDNRY_API_KEY,
	api_secret: process.env.CLDNRY_API_SECRET,
});
/* user stuff */
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import articleRouter from "./routes/articleRouter";
import actionRouter from "./routes/actionRouter";
import commentRouter from "./routes/commentRouter";
import errorHandlerMiddleware from "./middleware/error-handle";
import notFoundMiddleware from "./middleware/not-found";
import "./passport";

const app = express();

/* middleware */
app.set("trust proxy", 1);
app.get("/ip", (request, response) => response.send(request.ip)); // test how many proxies in production
app.use(
	rateLimit({
		windowMs: 60 * 1000,
		max: 50,
		message: { msg: "Too many requests..." },
	})
); //set numbers that fit best and check if needed in production
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(buildCheckFunction(["body", "query", "params"])());

//dev middleware
if (process.env.NODE_ENV !== "production") {
	const morgan = require("morgan");
	app.use(morgan("tiny"));
}

const sessionStore = new MongoStore({
	mongoUrl: process.env.MONGO_URL,
	collectionName: "sessions",
});
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
			maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
		},
	})
);

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

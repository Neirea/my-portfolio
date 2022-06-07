require("express-async-errors"); // see if it works
import express from "express";
//packages
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
/* routers */
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
/* test */
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { loginGithub } from "./passportStrategies";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();
cloudinary.v2.config({
	cloud_name: process.env.CLDNRY_NAME,
	api_key: process.env.CLDNRY_API_KEY,
	api_secret: process.env.CLDNRY_API_SECRET,
});

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
				? "my production url"
				: "http://localhost:3000",
	})
); //check if any other requests are coming
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));
//add csrf middleware from csurf?

const sessionStore = new MongoStore({
	mongoUrl: process.env.MONGO_URL,
	collectionName: "sessions",
});
//session middleware
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

/* ----- */

/* Error handling */

export default app;

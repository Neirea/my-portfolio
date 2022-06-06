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
app.use(cors({ origin: process.env.ORIGIN_URL })); //check if any other requests are coming
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));

/* use routers */

/* Error handling */

export default app;

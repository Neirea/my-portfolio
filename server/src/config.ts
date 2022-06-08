import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

declare module "express-session" {
	interface Session {
		user: {
			_id: string;
			role: string;
			platform_type: string;
			platform_id: number;
			name: string;
			isBanned: boolean;
			avatar_url: string;
		};
		accessToken: string | undefined;
	}
}

dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLDNRY_NAME,
	api_key: process.env.CLDNRY_API_KEY,
	api_secret: process.env.CLDNRY_API_SECRET,
});

export const sessionStore = new MongoStore({
	mongoUrl: process.env.MONGO_URL,
	collectionName: "sessions",
});

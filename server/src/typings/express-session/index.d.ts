// import { IUser } from "../models/User";
import "express-session";

declare module "express-session" {
	interface SessionData {
		user: import("../../models/User").IUser;
		accessToken: string | undefined;
		refreshToken: string | undefined;
	}
}

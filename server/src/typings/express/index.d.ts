import { IUser } from "../../models/User";

declare global {
	namespace Express {
		interface User {
			user: IUser;
			accessToken: string | undefined;
			refreshToken: string | undefined;
		}
	}
}

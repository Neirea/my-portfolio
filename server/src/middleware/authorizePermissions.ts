import { NextFunction, Request, Response } from "express";
import CustomError from "../errors";
import { userRoles } from "../models/User";

/* authorize permissions */
//checks for correct role (function gets invoked right away and returns callback function as middleware)
const authorizePermissions = (...roles: userRoles[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.some((item) => req.session.user?.roles.includes(item))) {
			throw new CustomError.UnauthorizedError(
				"Unauthorized to access this route"
			);
		}
		next();
	};
};

export default authorizePermissions;

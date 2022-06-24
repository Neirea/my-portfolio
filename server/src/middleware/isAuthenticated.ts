import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors";

const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.session.user) {
		//we don't spam user with errors on reload
		if (req.originalUrl === "/api/user/showMe") {
			res.status(200).json(false);
			return;
		}
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}
	next();
};

export default isAuthenticated;

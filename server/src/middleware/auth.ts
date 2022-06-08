import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import CustomError from "../errors";

export const isAuthenticated = async (
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
		//cloudinary delete file
		const image = req.files?.image as UploadedFile;
		if (image) fs.unlinkSync(image.tempFilePath);
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}
	next();
};

/* authorize permissions */
//checks for correct role (function gets invoked right away and returns callback function as middleware)
export const authorizePermissions = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.session.user.role)) {
			throw new CustomError.UnauthorizedError(
				"Unauthorized to access this route"
			);
		}
		next();
	};
};
import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
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
		//cloudinary delete file
		const image = req.files?.image as UploadedFile;
		if (image) fs.unlinkSync(image.tempFilePath);
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}
	next();
};

export default isAuthenticated;

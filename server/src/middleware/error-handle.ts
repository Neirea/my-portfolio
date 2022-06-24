import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { Error as MongooseError } from "mongoose";

const errorHandlerMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// set default error
	const customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again later",
	};
	if (err instanceof MongooseError.ValidationError) {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(",");
		customError.statusCode = 400;
	}
	if (err instanceof MongooseError.CastError) {
		customError.msg = `No item found with id : ${err.value}`;
		customError.statusCode = 404;
	}
	if (err.code && err.code === 11000) {
		customError.msg = `This ${Object.keys(err.keyValue)} already exists`;
		customError.statusCode = 400;
	}
	//delete tmp file
	const image = req.files?.image as UploadedFile | undefined;
	if (image) fs.unlinkSync(image.tempFilePath);

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;

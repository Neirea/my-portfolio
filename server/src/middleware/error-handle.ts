import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

//test errors

const errorHandlerMiddleware = (
	err: MongooseError | any,
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
	//mongoDB error? any
	if (err.code && err.code === 11000) {
		customError.msg = `This ${Object.keys(err.keyValue)} already exists`;
		customError.statusCode = 400;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;

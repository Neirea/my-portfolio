import type { ErrorRequestHandler } from "express";
import type { UploadedFile } from "express-fileupload";
import fs from "fs";
import { Error as MongooseError } from "mongoose";
import { StatusCodes } from "../utils/httpStatusCodes.js";

interface MyError extends Error {
    statusCode?: number;
    code?: number;
    keyValue: Record<string, any>;
}

const errorHandlerMiddleware: ErrorRequestHandler = (
    err: MyError,
    req,
    res,
    next,
) => {
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
        customError.msg = `This ${Object.keys(err.keyValue).join(",")} already exists`;
        customError.statusCode = 400;
    }
    const image = req.files?.image as UploadedFile | undefined;
    if (image) fs.unlinkSync(image.tempFilePath);

    console.error(customError.msg);

    res.status(customError.statusCode).json({ msg: customError.msg });
    next(err);
};

export default errorHandlerMiddleware;

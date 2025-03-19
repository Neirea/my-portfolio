import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors";

const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (!req.session.user) {
        if (req.originalUrl === "/api/user/showMe") {
            res.status(200).json(false);
            return;
        }
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    next();
};

export default isAuthenticated;

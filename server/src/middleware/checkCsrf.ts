import type { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/badRequest";

const checkCsrf = (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers["csrf-token"] !== req.session.csrfToken) {
        throw new BadRequestError("Failed to proceed: Bad csrf token");
    }
    next();
};

export default checkCsrf;

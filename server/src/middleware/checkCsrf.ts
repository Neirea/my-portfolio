import type { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/bad-request";

export default function (req: Request, res: Response, next: NextFunction) {
    if (req.headers["csrf-token"] !== req.session.csrfToken) {
        throw new BadRequestError("Failed to proceed: Bad csrf token");
    }
    next();
}

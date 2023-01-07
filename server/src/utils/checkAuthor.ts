import CustomError from "../errors/index";
import type { Request } from "express";

export default function checkAuthor(req: Request, commentUserId: string) {
    if (req.session.user?._id !== commentUserId) {
        throw new CustomError.UnauthorizedError("Can't perform this action");
    }
    return true;
}

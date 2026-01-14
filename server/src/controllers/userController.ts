import type { Request, Response } from "express";
import CustomError from "../errors/index.js";
import User from "../models/User.js";
import { StatusCodes } from "../utils/httpStatusCodes.js";

export const showMe = (req: Request, res: Response): void => {
    const user = req.session.user;
    res.status(StatusCodes.OK).json({ user, csrfToken: req.session.csrfToken });
};

export const getAllUsers = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const users = await User.find({});
    if (!users) {
        throw new CustomError.NotFoundError("No users found");
    }
    res.status(StatusCodes.OK).json({ users });
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new CustomError.NotFoundError(
            `No user with id : ${userId as string}`,
        );
    }

    const bannedValue = user.isBanned ? false : true;
    user.isBanned = bannedValue;
    await user.save();

    res.status(StatusCodes.OK).json({
        msg: user.isBanned ? "User was banned" : "User was unbanned",
    });
};

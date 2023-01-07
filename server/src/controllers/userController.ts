import crypto from "crypto";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import User from "../models/User";

export const showMe = (req: Request, res: Response) => {
    const user = req.session.user;
    const newToken = crypto.randomUUID();
    req.session.csrfToken = newToken;
    res.status(StatusCodes.OK).json({ user, csrfToken: newToken });
};

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find({});
    if (!users) {
        throw new CustomError.NotFoundError("No users found");
    }
    res.status(StatusCodes.OK).json({ users });
};

export const banUser = async (req: Request, res: Response) => {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new CustomError.NotFoundError(
            `No user with id : ${req.params.id}`
        );
    }
    const bannedValue = user.isBanned ? false : true;

    //marks user as banned/unbanned
    user.isBanned = bannedValue;
    user.save();

    res.status(StatusCodes.OK).json({
        msg: user.isBanned ? "User was banned" : "User was unbanned",
    });
};

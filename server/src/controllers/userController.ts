import { Request, Response } from "express";
import User from "../models/User";
import Comment from "../models/Comment";
import CustomError from "../errors";
import { StatusCodes } from "http-status-codes";

export const showMe = (req: Request, res: Response) => {
	const user = req.session.user;
	res.status(StatusCodes.OK).json({ user });
};

export const banUser = async (req: Request, res: Response) => {
	const { id: userId } = req.params;
	const user = await User.findOne({ _id: userId });

	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
	}
	const bannedValue = user.isBanned ? false : true;

	//marks user as banned/unbanned
	user.isBanned = bannedValue;
	user.save();

	res
		.status(StatusCodes.OK)
		.json({ msg: user.isBanned ? "User was banned" : "User was unbanned" });
};

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
	const userId = req.params.id;
	const user = await User.findOne({ _id: userId });

	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
	}
	//marks user as banned/unbanned
	const bannedValue = user.isBanned ? false : true;
	//marks all user's comments with it as well
	const comments = await Comment.find({
		author: { id: user._id, name: user.name, isBanned: user.isBanned },
	});
	if (comments) {
		comments.forEach((comment) => {
			comment.user.isBanned = bannedValue;
			comment.save();
		});
	}

	user.isBanned = bannedValue;
	user.save();
	res
		.status(StatusCodes.OK)
		.json({ msg: user.isBanned ? "User was banned" : "User was unbanned" });
};

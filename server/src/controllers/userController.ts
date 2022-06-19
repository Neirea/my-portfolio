import { Request, Response } from "express";
import User from "../models/User";
import CustomError from "../errors";
import { StatusCodes } from "http-status-codes";
import { userRoles } from "../models/User";

export const showMe = (req: Request, res: Response) => {
	const user = req.session.user;
	res.status(StatusCodes.OK).json({ user });
};

export const getAllUsers = async (req: Request, res: Response) => {
	const users = await User.find({});
	if (!users) {
		throw new CustomError.NotFoundError("No users found");
	}
	res.status(StatusCodes.OK).json({ users });
};

export const updateUser = async (req: Request, res: Response) => {
	const { _id, name, roles, avatar_url } = req.body;
	const user = await User.findOne({ _id: _id });
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${_id}`);
	}
	const vialbeRoles = Object.values(userRoles) as string[];
	const areRolesValid = (roles as string[]).every((item) =>
		vialbeRoles.includes(item)
	);

	if (!areRolesValid) {
		throw new CustomError.BadRequestError("Some roles are invalid");
	}
	user.name = name;
	user.roles = roles;
	user.avatar_url = avatar_url;
	user.save();
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

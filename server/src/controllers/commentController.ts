import Article from "../models/Article";
import User from "../models/User";
import Comment, { IComment } from "../models/Comment";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { Request, Response } from "express";

export const getAllComments = async (req: Request, res: Response) => {
	const { articleId } = req.params;

	//gets all top level comments
	const comments = await Comment.find({
		articleId: articleId,
		parentId: null,
	}).sort({ createdAt: "descending" });

	res.status(StatusCodes.OK).json({ comments });
};

export const getSingleComment = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;

	const comment = await Comment.findOne({ _id: commentId });
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}
	res.status(StatusCodes.OK).json({ comment });
};

export const createComment = async (req: Request, res: Response) => {
	const { userId, message, parentId } = req.body;

	const { articleId } = req.params;

	const author = await User.findOne({ _id: userId });
	if (!author) {
		throw new CustomError.NotFoundError(`No user with id : ${userId}`);
	}

	if (author.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}

	const user = {
		id: author._id,
		name: author.name,
		isBanned: author.isBanned,
	};

	const isValidProduct = await Article.findOne({ _id: articleId });
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`No article with id : ${articleId}`);
	}

	const newComment = { articleId, user, message, parentId };

	const comment = await Comment.create(newComment);

	//update parent's replies property
	if (comment.parentId) {
		const updateParent = await Comment.findOne({ _id: comment.parentId });
		if (!updateParent) {
			throw new CustomError.NotFoundError(
				`No parent comment with id : ${comment.parentId}`
			);
		}
		updateParent.replies.push(comment);
		await updateParent.save();
	}

	res.status(StatusCodes.CREATED).json({ comment });
};
//updates msg
export const updateComment = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;
	const { message } = req.body;

	const comment = await Comment.findOne({ _id: commentId });
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}

	if (comment.user.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}
	comment.editedAt = new Date();
	comment.message = message;
	await comment.save();
	res.status(StatusCodes.OK).json({ comment });
};
//deletes msg from comment
export const deleteComment = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;

	const comment = await Comment.findOne({ _id: commentId });
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}

	if (comment.user.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}

	if (!comment.replies.length) {
		await comment.remove();
		res.status(StatusCodes.OK).json({ msg: "Success! Comment was deleted" });
		return;
	}
	comment.message = "";
	comment.save();
	res.status(StatusCodes.OK).json({ comment });
};

//deletes comment and all of its nested comments
export const deleteCommentsAdmin = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;
	const comment = await Comment.findOne({ _id: commentId });
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}

	//adds all ids of nested elements to array
	const parseReplies = (comments: IComment[], array: number[]) => {
		for (let i = 0; i < comments.length; i++) {
			array.push(comments[i]._id);
			parseReplies(comments[i].replies, array);
		}
	};
	let repliesArray: number[] = [];
	parseReplies([comment], repliesArray);

	//delete comment and its replies
	await Comment.deleteMany({ _id: repliesArray });

	res
		.status(StatusCodes.OK)
		.json({ msg: "Success! Comment and its children were deleted" });
};

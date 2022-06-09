import Article from "../models/Article";
import User from "../models/User";
import Comment from "../models/Comment";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { Request, Response } from "express";
import mongoose from "mongoose";

//gets all top level comments
export const getAllComments = async (req: Request, res: Response) => {
	const { article: articleId } = req.params;

	const comments = await Comment.find({
		article: articleId,
		parent: null,
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

export const createComment = async (
	// req: Request<{ article: number }, {}, CommentModel>,
	req: any,
	res: Response
) => {
	// const newComment = ({ user, message, parentId } = req.body);
	const { user, message, parentId } = req.body;
	const newComment: any = { user, message, parentId };
	const { article: articleId } = req.params;

	const author = await User.findOne({ _id: newComment.user });
	if (!author) {
		throw new CustomError.NotFoundError(`No user with id : ${newComment.user}`);
	}

	if (author.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}
	newComment.user = {
		id: author._id,
		name: author.name,
		isBanned: author.isBanned,
	};

	const isValidProduct = await Article.findOne({ _id: articleId });
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`No article with id : ${articleId}`);
	}
	newComment.articleId = articleId;

	const comment = await Comment.create(newComment);
	//update parent's replies property
	if (comment.parentId) {
		const updateParent = await Comment.findOne({ _id: comment.parentId });
		if (updateParent) {
			updateParent.replies = [...updateParent.replies, comment._id];
			await updateParent.save();
		}
	}

	res.status(StatusCodes.CREATED).json({ comment });
};
//updates msg
export const updateComment = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;
	const { message } = req.body;

	const comment = await Comment.findOne({ _id: commentId });
	if (comment?.user.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}
	comment.message = message;
	await comment.save();
	res.status(StatusCodes.OK).json({ comment });
};
//deletes msg from comment
export const deleteComment = async (req: Request, res: Response) => {
	const { id: commentId } = req.params;

	const comment = await Comment.findOne({ _id: commentId });
	if (comment?.user.isBanned) {
		throw new CustomError.BadRequestError(
			"You are currently suspended from posting comments"
		);
	}
	if (!comment) {
		throw new CustomError.NotFoundError(`No comment with id : ${commentId}`);
	}
	if (comment.replies.length === 0) {
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
	const parseReplies = (comments: any, array: any) => {
		for (let i = 0; i < comments.length; i++) {
			array.push(comments[i]._id);
			parseReplies(comments[i].replies, array);
		}
	};
	let commentsArray = new Array();
	const wrapped = [comment].flat(); //to wrap comment into array for parse function
	parseReplies(wrapped, commentsArray);
	//deletion
	commentsArray.forEach(async (element) => {
		await Comment.deleteOne({ _id: element });
	});

	res
		.status(StatusCodes.OK)
		.json({ msg: "Success! Comment and its children were deleted" });
};

import type { Request, Response } from "express";
import CustomError from "../errors";
import Article from "../models/Article";
import Comment, { type Comment as TComment } from "../models/Comment";
import { StatusCodes } from "../utils/http-status-codes";

export const getAllComments = async (req: Request, res: Response) => {
    const { articleId } = req.params;

    //gets all top level comments
    const comments = await Comment.find({
        articleId: articleId,
        parentId: null,
    });

    res.status(StatusCodes.OK).json({ comments });
};

export const createComment = async (req: Request, res: Response) => {
    const { message, parentId } = req.body;

    const { articleId } = req.params;

    const user = {
        id: req.session.user?._id,
        name: req.session.user?.name,
        avatar: req.session.user?.avatar_url,
    };

    const isValidProduct = await Article.findOne({ _id: articleId });
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(
            `No article with id : ${articleId}`
        );
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
        throw new CustomError.NotFoundError(
            `No comment with id : ${commentId}`
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
        throw new CustomError.NotFoundError(
            `No comment with id : ${commentId}`
        );
    }

    if (!comment.replies.length) {
        await comment.deleteOne();
        res.status(StatusCodes.OK).json({
            msg: "Success! Comment was deleted",
        });
        return;
    }
    comment.message = "";
    comment.save();
    res.status(StatusCodes.OK).json({ comment });
};

//deletes comment and all of its nested comments
export const deleteCommentsCascade = async (req: Request, res: Response) => {
    const { id: commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
        throw new CustomError.NotFoundError(
            `No comment with id : ${commentId}`
        );
    }

    //adds all ids of nested elements to array
    const parseReplies = (comments: TComment[], array: number[]) => {
        for (const comment of comments) {
            array.push(comment._id);
            parseReplies(comment.replies, array);
        }
    };
    let repliesArray: number[] = [];
    parseReplies([comment], repliesArray);

    //delete comment and its replies
    await Comment.deleteMany({ _id: repliesArray });

    res.status(StatusCodes.OK).json({
        msg: "Success! Comment and its children were deleted",
    });
};

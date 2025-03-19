import type { Request, Response } from "express";
import mongoose from "mongoose";
import CustomError from "../errors";
import Article from "../models/Article";
import Comment, { type Comment as TComment } from "../models/Comment";
import { StatusCodes } from "../utils/httpStatusCodes";
import { MongooseDocument } from "../utils/mongoose.type";

export const getAllComments = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { articleId } = req.params;

    const comments = await Comment.find({
        articleId: articleId,
        parentId: null,
    });

    res.status(StatusCodes.OK).json({ comments });
};

interface CreateCommentRequest extends Request {
    body: {
        message: string;
        parentId: string;
    };
}

export const createComment = async (
    req: CreateCommentRequest,
    res: Response,
): Promise<void> => {
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
            `No article with id : ${articleId}`,
        );
    }

    const newComment = { articleId, user, message, parentId };

    const comment = await Comment.create(newComment);

    if (comment.parentId) {
        const updateParent = await Comment.findOne({ _id: comment.parentId });
        if (!updateParent) {
            throw new CustomError.NotFoundError(
                `No parent comment with id : ${comment.parentId.toString()}`,
            );
        }
        updateParent.replies.push(comment);
        await updateParent.save();
    }

    res.status(StatusCodes.CREATED).json({ comment });
};

interface UpdateCommentRequest extends Request {
    body: {
        message: string;
        parentId: string;
    };
}

export const updateComment = async (
    req: UpdateCommentRequest,
    res: Response,
): Promise<void> => {
    const { message } = req.body;
    const id = req.params.id;
    const authorId = req.query.authorId as string | undefined;
    const comment = await fetchComment(id, authorId);

    comment.editedAt = new Date();
    comment.message = message;
    await comment.save();
    res.status(StatusCodes.OK).json({ comment });
};

export const deleteComment = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = req.params.id;
    const authorId = req.query.authorId as string | undefined;
    const comment = await fetchComment(id, authorId);

    if (!comment.replies.length) {
        await comment.deleteOne();
        res.status(StatusCodes.OK).json({
            msg: "Success! Comment was deleted",
        });
        return;
    }
    comment.message = "";
    await comment.save();
    res.status(StatusCodes.OK).json({ comment });
};

export const deleteCommentsCascade = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = req.params.id;
    const authorId = req.query.authorId as string | undefined;
    const comment = await fetchComment(id, authorId);

    const parseReplies = (
        comments: TComment[],
        array: mongoose.Types.ObjectId[],
    ): void => {
        for (const comment of comments) {
            array.push(comment._id);
            parseReplies(comment.replies, array);
        }
    };
    const repliesArray: mongoose.Types.ObjectId[] = [];
    parseReplies([comment], repliesArray);

    await Comment.deleteMany({ _id: repliesArray });

    res.status(StatusCodes.OK).json({
        msg: "Success! Comment and its children were deleted",
    });
};

const fetchComment = async (
    id: string | undefined,
    authorId: string | undefined,
): Promise<MongooseDocument<TComment>> => {
    if (!id || !authorId) {
        throw new CustomError.BadRequestError(
            "Comment id or/and authorId are missing",
        );
    }

    const comment = await Comment.findOne({ _id: id, "user.id": authorId });

    if (!comment) {
        throw new CustomError.NotFoundError(`Comment not found with id: ${id}`);
    }
    return comment;
};

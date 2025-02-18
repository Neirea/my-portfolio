jest.mock("../middleware/isAuthenticated", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        req.session = {} as Session;
        req.session.user = {
            _id: fakeUser._id,
            name: fakeUser.name,
            roles: ["admin"],
        } as TUser;
        next();
    })
);

jest.mock("../middleware/checkCsrf", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    })
);

import type { NextFunction, Request, Response } from "express";
import { Session } from "express-session";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import Article from "../models/Article";
import Comment from "../models/Comment";
import { User as TUser } from "../models/User";
import * as dbHandler from "./db";

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

const fakeUser = {
    _id: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f46"),
    platform_id: 12345,
    platform_name: "Fake",
    platform_type: "google",
    name: "fake user",
    roles: ["user"],
    avatar_url: "http://some_image",
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
};

const fakeArticle = {
    title: "basic article",
    content: "12312312312312313123",
    category: "blog",
    code_languages: [],
    tags: ["typescript", "jsx"],
    source_link: undefined,
    demo_link: undefined,
    image: "test.jpg",
    img_id: "5dbff32e367a343830cd2f41",
    userId: fakeUser._id,
    slug: "blog 1",
};

const createArticleUserComment = async () => {
    const article = await Article.create(fakeArticle);
    const fakeComment = {
        user: {
            id: fakeUser._id,
            name: fakeUser.name,
        },
        articleId: article._id.toString(),
        message: "hello world",
        parentId: null,
    };
    const comment = await Comment.create(fakeComment);
    return { article, comment };
};

describe("createComment", () => {
    test("should create comment and reply to it", async () => {
        const { article, comment } = await createArticleUserComment();

        const commentData = {
            parentId: comment._id.toString(),
            message: "hello world",
        };

        const response = await request(app)
            .post(`/api/comment/${article._id.toString()}`)
            .send(commentData);

        expect(response.status).toBe(201);
        expect(response.body.comment.parentId).toStrictEqual(
            comment._id.toString()
        );
        const updatedComment = await Comment.findOne({
            _id: comment._id.toString(),
        });
        expect(updatedComment!.replies[0]?._id.toString()).toStrictEqual(
            response.body.comment._id
        );
    });
});

describe("getAllComments", () => {
    test("should get all root comments", async () => {
        const { article, comment } = await createArticleUserComment();
        const fakeReply = {
            user: {
                id: fakeUser._id,
                name: fakeUser.name,
            },
            articleId: article._id.toString(),
            message: "reply to hello world",
            parentId: comment._id.toString(),
        };
        await Comment.create(fakeReply);

        const response = await request(app).get(
            `/api/comment/${article._id.toString()}`
        );

        expect(response.body.comments[0]._id).toStrictEqual(
            comment._id.toString()
        );
        expect(response.body.comments.length).toBe(1);
        expect(response.status).toBe(200);
    });
});

describe("updateComment", () => {
    test("should update comments text", async () => {
        const { article, comment } = await createArticleUserComment();

        const response = await request(app)
            .patch(
                `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${
                    fakeUser._id
                }`
            )
            .send({ message: "updated comment" });

        expect(response.status).toBe(200);
        expect(response.body.comment.message).toStrictEqual("updated comment");
    });
});

describe("deleteComment", () => {
    test("should delete comment that has no replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const response = await request(app).delete(
            `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${
                fakeUser._id
            }`
        );
        expect(response.status).toBe(200);
        expect(response.body.msg).toStrictEqual("Success! Comment was deleted");
    });
    test("should delete comment that has replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const replyCommentData = {
            parentId: comment._id.toString(),
            message: "hello world",
        };
        await request(app)
            .post(`/api/comment/${article._id.toString()}`)
            .send(replyCommentData);

        const response = await request(app).delete(
            `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${
                fakeUser._id
            }`
        );

        expect(response.status).toBe(200);
        expect(response.body.comment.message).toStrictEqual("");
    });
});

describe("deleteCommentsAdmin", () => {
    test("should delete comment and its replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const replyCommentData = {
            parentId: comment._id.toString(),
            message: "hello world",
        };
        await request(app)
            .post(`/api/comment/${article._id.toString()}`)
            .send(replyCommentData);

        const response = await request(app).delete(
            `/api/comment/${article._id.toString()}/d_all/${comment._id.toString()}?authorId=${
                fakeUser._id
            }`
        );
        const comments = await Comment.find({});
        expect(response.status).toBe(200);
        expect(comments.length).toBe(0);
    });
});

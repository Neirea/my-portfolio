import type { NextFunction, Request, Response } from "express";
import { Session } from "express-session";
import mongoose from "mongoose";
import request from "supertest";
import type { App } from "supertest/types.js";
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    test,
    vi,
} from "vitest";
import app from "../app.js";
import Article, { type Article as TArticle } from "../models/Article.js";
import Comment, { type Comment as TComment } from "../models/Comment.js";
import type { User as TUser } from "../models/User.js";
import type { MongooseDocument } from "../utils/mongoose.type.js";
import * as dbHandler from "./db.js";

vi.mock("../middleware/isAuthenticated", () => ({
    default: vi.fn((req: Request, res: Response, next: NextFunction): void => {
        req.session = {} as Session;
        req.session.user = {
            _id: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f46"),
            name: "fake admin",
            roles: ["admin"],
        } as TUser;
        next();
    }),
}));
vi.mock("../middleware/checkCsrf", () => ({
    default: vi.fn((req: Request, res: Response, next: NextFunction): void => {
        next();
    }),
}));

vi.mock("../middleware/rateLimit", () => ({
    default: vi.fn(
        () =>
            (req: Request, res: Response, next: NextFunction): void => {
                next();
            },
    ),
}));

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

const fakeUser: TUser = {
    _id: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f47"),
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
    html: "12312312312312313123",
    category: "blog",
    tags: ["typescript", "jsx"],
    source_link: undefined,
    demo_link: undefined,
    image: "test.jpg",
    img_id: "5dbff32e367a343830cd2f41",
    userId: fakeUser._id,
    slug: "blog 1",
};

const createArticleUserComment = async (): Promise<{
    article: MongooseDocument<TArticle>;
    comment: MongooseDocument<TComment>;
}> => {
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

        const response = await request(app as App)
            .post(`/api/comment/${article._id.toString()}`)
            .send(commentData);

        const responseBody = response.body as { comment: TComment };
        expect(response.status).toBe(201);
        expect(responseBody.comment.parentId).toStrictEqual(
            comment._id.toString(),
        );
        const updatedComment = await Comment.findOne({
            _id: comment._id.toString(),
        });
        expect(updatedComment?.replies[0]?._id.toString()).toStrictEqual(
            responseBody.comment._id,
        );
    });
    test("should return 404 if article does not exist", async () => {
        const response = await request(app as App)
            .post(`/api/comment/5dbff32e367a343830cd2f48`)
            .send({
                message: "This is a comment",
                parentId: null,
            });

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
            msg: "No article with id : 5dbff32e367a343830cd2f48",
        });
    });
    test("should return 400 if required fields are missing", async () => {
        const { article } = await createArticleUserComment();

        const response = await request(app as App)
            .post(`/api/comment/${article._id.toString()}`)
            .send({});

        console.log(response.body);
        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            msg: "body.message: Invalid input: expected string, received undefined\nbody.parentId: Invalid input: expected string, received undefined",
        });
    });
    test("should return 404 if parent comment does not exist", async () => {
        const { article } = await createArticleUserComment();

        const response = await request(app as App)
            .post(`/api/comment/${article._id.toString()}`)
            .send({
                message: "This is a reply",
                parentId: "5dbff32e367a343830cd2f48",
            });

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
            msg: "No parent comment with id : 5dbff32e367a343830cd2f48",
        });
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

        const response = await request(app as App).get(
            `/api/comment/${article._id.toString()}`,
        );

        const responseBody = response.body as { comments: TComment[] };

        expect(responseBody.comments[0]?._id).toStrictEqual(
            comment._id.toString(),
        );
        expect(responseBody.comments.length).toBe(1);
        expect(response.status).toBe(200);
    });
});

describe("updateComment", () => {
    test("should update comments text", async () => {
        const { article, comment } = await createArticleUserComment();

        const response = await request(app as App)
            .patch(
                `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${fakeUser._id.toString()}`,
            )
            .send({ message: "updated comment" });

        expect(response.status).toBe(200);
        expect(
            (response.body as { comment: TComment }).comment.message,
        ).toStrictEqual("updated comment");
    });
    test("should return 404 if comment does not exist", async () => {
        const { article } = await createArticleUserComment();

        const commentId = "5dbff32e367a343830cd2f49";

        const response = await request(app as App)
            .patch(
                `/api/comment/${article._id.toString()}/${commentId}?authorId=${fakeUser._id.toString()}`,
            )
            .send({ message: "Updated message" });

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
            msg: `Comment not found with id: ${commentId}`,
        });
    });
});

describe("deleteComment", () => {
    test("should delete comment that has no replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const response = await request(app as App).delete(
            `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${fakeUser._id.toString()}`,
        );
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
            msg: "Success! Comment was deleted",
        });
    });
    test("should delete comment that has replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const replyCommentData = {
            parentId: comment._id.toString(),
            message: "hello world",
        };
        await request(app as App)
            .post(`/api/comment/${article._id.toString()}`)
            .send(replyCommentData);

        const response = await request(app as App).delete(
            `/api/comment/${article._id.toString()}/${comment._id.toString()}?authorId=${fakeUser._id.toString()}`,
        );

        expect(response.status).toBe(200);
        expect(
            (response.body as { comment: TComment }).comment.message,
        ).toStrictEqual("");
    });
    test("should return 404 if comment does not exist", async () => {
        const { article } = await createArticleUserComment();

        const commentId = "5dbff32e367a343830cd2f49";

        const response = await request(app as App).delete(
            `/api/comment/${article._id.toString()}/${commentId}?authorId=${fakeUser._id.toString()}`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
            msg: `Comment not found with id: ${commentId}`,
        });
    });
});

describe("deleteCommentsAdmin", () => {
    test("should delete comment and its replies", async () => {
        const { article, comment } = await createArticleUserComment();

        const replyCommentData = {
            parentId: comment._id.toString(),
            message: "hello world",
        };
        await request(app as App)
            .post(`/api/comment/${article._id.toString()}`)
            .send(replyCommentData);

        const response = await request(app as App).delete(
            `/api/comment/${article._id.toString()}/d_all/${comment._id.toString()}?authorId=${fakeUser._id.toString()}`,
        );
        const comments = await Comment.find({});
        expect(response.status).toBe(200);
        expect(comments.length).toBe(0);
    });
    test("should return 404 if comment does not exist", async () => {
        const { article } = await createArticleUserComment();

        const commentId = "5dbff32e367a343830cd2f49";

        const response = await request(app as App).delete(
            `/api/comment/${article._id.toString()}/d_all/${commentId}?authorId=${fakeUser._id.toString()}`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({
            msg: `Comment not found with id: ${commentId}`,
        });
    });
});

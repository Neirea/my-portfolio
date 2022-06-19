//need to import this after middleware mock
jest.mock("../middleware/isAuthenticated", () =>
	jest.fn((req: Request, res: Response, next: NextFunction) => {
		next();
	})
);
jest.mock("../middleware/authorizePermissions", () =>
	jest.fn(() => {
		return (req: Request, res: Response, next: NextFunction) => {
			next();
		};
	})
);

import { Request, Response, NextFunction } from "express";
import request from "supertest";
import User from "../models/User";
import Comment from "../models/Comment";
import Article from "../models/Article";
import * as dbHandler from "./db";
import app from "../app";

//spin fake mongodb server before each
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
	platform_id: "12345",
	platform_name: "google",
	name: "fake user",
	roles: ["user"],
	avatar_url: "http://some_image",
	isBanned: false,
	createdAt: Date.now(),
	updatedAt: Date.now(),
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
	userId: "5dbff32e367a343830cd2f46",
};

const createArticleUserComment = async () => {
	const user = await User.create(fakeUser);
	const article = await Article.create(fakeArticle);
	const fakeComment = {
		user: {
			id: user._id.toString(),
			name: user.name,
		},
		articleId: article._id.toString(),
		message: "hello world",
		parentId: null,
	};
	const comment = await Comment.create(fakeComment);
	return { user, article, comment };
};

describe("createComment", () => {
	test("should create comment and reply to it", async () => {
		const { user, article, comment } = await createArticleUserComment();

		const commentData = {
			userId: user._id.toString(),
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
		//check if it updated parent's replies
		const updatedComment = await Comment.findOne({
			_id: comment._id.toString(),
		});
		expect(updatedComment!.replies[0]._id.toString()).toStrictEqual(
			response.body.comment._id
		);
	});
});

describe("getAllComments", () => {
	test("should get all root coments", async () => {
		const { user, article, comment } = await createArticleUserComment();
		const fakeReply = {
			user: {
				id: user._id.toString(),
				name: user.name,
			},
			articleId: article._id.toString(),
			message: "reply to hello world",
			parentId: comment._id.toString(),
		};
		//reply
		await Comment.create(fakeReply);

		const response = await request(app).get(
			`/api/comment/${article._id.toString()}`
		);

		expect(response.body.comments[0]._id).toStrictEqual(comment._id.toString());
		//should return only 1 value and ignore reply
		expect(response.body.comments.length).toBe(1);
		expect(response.status).toBe(200);
	});
});

describe("updateComment", () => {
	test("should update comments text", async () => {
		const { article, comment } = await createArticleUserComment();

		const response = await request(app)
			.patch(`/api/comment/${article._id.toString()}/${comment._id.toString()}`)
			.send({ message: "updated comment" });

		expect(response.status).toBe(200);
		expect(response.body.comment.message).toStrictEqual("updated comment");
	});
});

describe("deleteComment", () => {
	test("should delete comment that has no replies", async () => {
		const { article, comment } = await createArticleUserComment();

		const response = await request(app).delete(
			`/api/comment/${article._id.toString()}/${comment._id.toString()}`
		);
		expect(response.status).toBe(200);
		expect(response.body.msg).toStrictEqual("Success! Comment was deleted");
	});
	test("should delete comment that has replies", async () => {
		const { user, article, comment } = await createArticleUserComment();

		//reply
		const commentData = {
			userId: user._id.toString(),
			parentId: comment._id.toString(),
			message: "hello world",
		};

		//already tested createComment request
		await request(app)
			.post(`/api/comment/${article._id.toString()}`)
			.send(commentData);

		const response = await request(app).delete(
			`/api/comment/${article._id.toString()}/${comment._id.toString()}`
		);

		expect(response.status).toBe(200);
		expect(response.body.comment.message).toStrictEqual("");
	});
});

describe("deleteCommentsAdmin", () => {
	test("should delete comment and its replies", async () => {
		const { user, article, comment } = await createArticleUserComment();

		//reply
		const commentData = {
			userId: user._id.toString(),
			parentId: comment._id.toString(),
			message: "hello world",
		};

		//already tested createComment request
		await request(app)
			.post(`/api/comment/${article._id.toString()}`)
			.send(commentData);

		const response = await request(app).delete(
			`/api/comment/${article._id.toString()}/d_all/${comment._id.toString()}`
		);
		//check if comments are gone
		const comments = await Comment.find({});
		expect(response.status).toBe(200);
		expect(comments.length).toBe(0);
	});
});

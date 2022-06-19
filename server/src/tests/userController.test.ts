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

describe("banUser", () => {
	test("should successfully ban user", async () => {
		const { user } = await createArticleUserComment();

		const response = await request(app).delete(
			`/api/user/${user._id.toString()}`
		);
		expect(response.body.msg).toStrictEqual("User was banned");
		const another = await request(app).delete(
			`/api/user/${user._id.toString()}`
		);
		expect(another.body.msg).toStrictEqual("User was unbanned");
	});
});

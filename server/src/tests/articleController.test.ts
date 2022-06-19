import { Request, Response, NextFunction } from "express";
import request from "supertest";
import isAuthenticated from "../middleware/isAuthenticated";
import authorizePermissions from "../middleware/authorizePermissions";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import Article from "../models/Article";
import path from "path";
import { IArticle } from "../models/Article";
import * as dbHandler from "./db";

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

//need to import this after middleware mock
//so it correctly applies to app.use
import app from "../app";

jest.mock("cloudinary");
const mockedCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

//spin fake mongodb server before each
beforeAll(async () => {
	await dbHandler.connect();
});

beforeEach(() => {
	// mockedCloudinary.uploader.upload = jest.fn();
	// mockedCloudinary.uploader.destroy = jest.fn();
});

afterEach(async () => {
	await dbHandler.clearDatabase();
});

afterAll(async () => {
	await dbHandler.closeDatabase();
});

const articleData = [
	{
		title: "unsanitized content",
		content: "hello darkness, my old friend!<script><div>test</div<</script>",
		category: "project",
		code_languages: [],
		tags: ["javascript"],
		source_link: undefined,
		demo_link: undefined,
		image: "test.jpg",
		img_id: "5dbff32e367a343830cd2f42",
		userId: "5dbff32e367a343830cd2f45",
	},
	{
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
	},
	{
		title: "failed to create",
		content: "123",
		category: "blogs",
		code_languages: [],
		tags: ["typescript", "jsx"],
		source_link: undefined,
		demo_link: undefined,
		image: "test.jpg",
		img_id: "5dbff32e367a343830cd2f42",
		userId: "5dbff32e367a343830cd2f46",
	},
	{
		title: "updated article",
		content: "12312312312312313123 asdasdasd",
		category: "project",
		code_languages: [],
		tags: ["javascript"],
		source_link: "http://test.com/src",
		demo_link: "http://test.com/demo",
		image: "updated.jpg",
		img_id: "5dbff32e367a343830cd2f40",
		userId: "5dbff32e367a343830cd2f45",
	},
];

describe("getAllArticles", () => {
	test("no projects found", async () => {
		const response = await request(app).get("/api/article/project");

		expect(response.status).toBe(404);
		expect(response.body.msg).toStrictEqual("No projects found");
	});
	test("should return blogs", async () => {
		const result = await Article.create(articleData[1]);
		const response = await request(app).get("/api/article/blog");

		const createdId = result._id.toString();
		expect(response.status).toBe(200);
		expect(response.body.articles[0]._id).toStrictEqual(createdId);
	});
});

describe("getSingleArticle", () => {
	test("no article Id found", async () => {
		const response = await request(app).get("/api/article/123");

		expect(response.status).toBe(404);
		expect(response.body.msg).toStrictEqual("No item found with id : 123");
	});
	test("article with Id found", async () => {
		const result = await Article.create(articleData[1]);
		const createdId = result._id.toString();
		const response = await request(app).get(`/api/article/${createdId}`);

		expect(response.status).toBe(200);
		expect(response.body.article._id).toStrictEqual(createdId);
	});
});

describe("createArticle", () => {
	test("successfully creating article with sanitized content", async () => {
		const response = await request(app)
			.post("/api/article")
			.send(articleData[0]);

		const result = await Article.findOne({
			content: "hello darkness, my old friend!",
		});

		//check if middleware was called
		expect(isAuthenticated).toHaveBeenCalledTimes(1);
		//this called multiple times because it uses wrapper with custom parameter
		expect(authorizePermissions).not.toHaveBeenCalledTimes(0);

		expect(response.status).toBe(201);
		expect(response.body.article._id).toStrictEqual(result!._id.toString());
	});
	test("Error: failed to create article", async () => {
		const response = await request(app)
			.post("/api/article")
			.send(articleData[2]);

		expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
		expect(response.body.msg).toStrictEqual("Failed to create article");
		expect(response.status).toBe(400);
	});
});

describe("updateArticle", () => {
	test("should successfully update article's image", async () => {
		const createdArticle = await Article.create(articleData[0]);
		const response = await request(app)
			.patch(`/api/article/${createdArticle._id.toString()}`)
			.send(articleData[3]);

		const result = await Article.findOne({ title: "updated article" });
		//check if condition for ids worked
		expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(2);
		expect(response.body.article.title).toStrictEqual(result!.title);
		expect(response.status).toBe(200);
	});
	test("should fail and not call cloudinary while updating article using same image", async () => {
		const createdArticle = await Article.create(articleData[0]);
		const response = await request(app)
			.patch(`/api/article/${createdArticle._id.toString()}`)
			.send(articleData[2]);
		//should not call destroy
		expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(2);
		expect(response.status).toBe(400);
	});
});
// describe("deleteArticle", () => {
// 	test("should delete article", async () => {
// 		//article.remove()
// 		mockArticle.prototype.remove = jest.fn(() => Promise.resolve("success"));
// 		const newArticle = new mockArticle(articleFindData[0]);
// 		Article.findOne = jest.fn().mockResolvedValueOnce(newArticle);

// 		const response = await request(app).delete("/api/article/123");
// 		expect(response.status).toBe(200);
// 		expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
// 		expect(response.body.msg).toStrictEqual("Success! Article is removed");
// 	});
// });
// describe("uploadArticleImage", () => {
// 	test("should upload image", async () => {
// 		const image = path.resolve(__dirname, "../test-files/N_logo.png");
// 		const result = {
// 			secure_url: "123",
// 			public_id: "456",
// 		} as UploadApiResponse;
// 		mockedCloudinary.uploader.upload = jest.fn(() => {
// 			return Promise.resolve(result);
// 		});

// 		const response = await request(app)
// 			.post("/api/article/upload")
// 			.attach("image", image);
// 		expect(response.status).toBe(200);
// 	});
// });

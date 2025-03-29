jest.mock("../middleware/isAuthenticated", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        req.session = {} as Session;
        req.session.user = {
            _id: fakeUser._id,
            name: fakeUser.name,
            roles: fakeUser.roles,
        } as TUser;
        next();
    }),
);
jest.mock("../middleware/checkCsrf", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
);

import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import type { NextFunction, Request, Response } from "express";
import { Session } from "express-session";
import mongoose from "mongoose";
import path from "path";
import request from "supertest";
import type { App } from "supertest/types.js";
import app from "../app.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import Article, { type Article as TArticle } from "../models/Article.js";
import type { User as TUser } from "../models/User.js";
import * as dbHandler from "./db.js";

jest.mock("cloudinary");
jest.mock("../db/redis");
const mockedCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

beforeAll(async () => {
    await dbHandler.connect();
});

beforeEach(() => {
    mockedCloudinary.uploader.destroy = jest.fn();
});

afterEach(async () => {
    (mockedCloudinary.uploader.destroy as jest.Mock).mockReset();
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

const fakeUser: TUser = {
    _id: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f46"),
    platform_id: 12345,
    platform_name: "Fake",
    platform_type: "google",
    name: "fake user",
    roles: ["admin"],
    avatar_url: "http://some_image",
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
};

const articleData = [
    {
        title: "unsanitized content",
        content:
            "hello darkness, my old friend!<script><div>test</div></script>",
        html: "hello darkness, my old friend!<script><div>test</div></script>",
        category: "projects",
        tags: ["javascript"],
        source_link: undefined,
        demo_link: undefined,
        image: "test.jpg",
        img_id: "5dbff32e367a343830cd2f42",
        userId: fakeUser._id,
        slug: "project 1",
    },
    {
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
    },
    {
        title: "failed to create",
        content: "123",
        html: "123",
        category: "blog",
        tags: ["typescript", "jsx"],
        source_link: undefined,
        demo_link: undefined,
        image: "test.jpg",
        img_id: "5dbff32e367a343830cd2f42",
        userId: fakeUser._id,
        slug: "blog 2",
    },
    {
        title: "updated article",
        content: "12312312312312313123 asdasdasd",
        html: "12312312312312313123 asdasdasd",
        category: "projects",
        tags: ["javascript"],
        source_link: "http://test.com/src",
        demo_link: "http://test.com/demo",
        image: "updated.jpg",
        img_id: "5dbff32e367a343830cd2f40",
        userId: fakeUser._id,
        slug: "project 2",
    },
];

describe("getAllArticles", () => {
    test("no projects found", async () => {
        const response = await request(app as App).get("/api/article/projects");

        expect(response.status).toBe(404);
        expect((response.body as { msg: string }).msg).toStrictEqual(
            "No projects found",
        );
    });
    test("should return blogs", async () => {
        const result = await Article.create(articleData[1]);
        const response = await request(app as App).get("/api/article/blog");

        const createdId = result._id.toString();
        expect(response.status).toBe(200);
        expect(
            (response.body as { articles: TArticle[] }).articles[0]?._id,
        ).toStrictEqual(createdId);
    });
});

describe("getSingleArticle", () => {
    test("no article Id found", async () => {
        const response = await request(app as App).get("/api/article/123");

        expect(response.status).toBe(404);
        expect((response.body as { msg: string }).msg).toStrictEqual(
            "No item found with id : 123",
        );
    });
    test("article with Id found", async () => {
        const result = await Article.create(articleData[1]);
        const createdId = result._id.toString();
        const response = await request(app as App).get(
            `/api/article/${createdId}`,
        );

        expect(response.status).toBe(200);
        expect(
            (response.body as { article: TArticle }).article?._id,
        ).toStrictEqual(createdId);
    });
});

describe("createArticle", () => {
    test("successfully creating article with sanitized content", async () => {
        const response = await request(app as App)
            .post("/api/article")
            .send(articleData[0]);

        const result = await Article.findOne({
            html: "hello darkness, my old friend!",
        });

        expect(isAuthenticated).toHaveBeenCalledTimes(1);

        expect(response.status).toBe(201);
        expect(
            (response.body as { article: TArticle }).article._id,
        ).toStrictEqual(result!._id.toString());
    });
    test("Error: failed to create article", async () => {
        const response = await request(app as App)
            .post("/api/article")
            .send(articleData[2]);

        expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
        expect((response.body as { msg: string }).msg).toStrictEqual(
            "Content can not be less than 10 characters,HTML can not be less than 10 characters",
        );
        expect(response.status).toBe(400);
    });
});

describe("updateArticle", () => {
    test("should successfully update article's image", async () => {
        const createdArticle = await Article.create(articleData[0]);
        const response = await request(app as App)
            .put(`/api/article/${createdArticle._id.toString()}`)
            .send(articleData[3]);

        const result = await Article.findOne({ title: "updated article" });
        expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
        expect(
            (response.body as { article: TArticle }).article.title,
        ).toStrictEqual(result!.title);
        expect(response.status).toBe(200);
    });
    test("should fail and not call cloudinary while updating article using same image", async () => {
        const createdArticle = await Article.create(articleData[0]);
        const response = await request(app as App)
            .put(`/api/article/${createdArticle._id.toString()}`)
            .send(articleData[2]);
        expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(0);
        expect(response.status).toBe(400);
    });
});

describe("deleteArticle", () => {
    test("should delete article", async () => {
        const createdArticle = await Article.create(articleData[0]);
        const deletedId = createdArticle._id.toString();

        const response = await request(app as App).delete(
            `/api/article/${deletedId}`,
        );
        expect(response.status).toBe(200);
        expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
        expect((response.body as { msg: string }).msg).toStrictEqual(
            "Success! Article is removed",
        );
    });
});

describe("uploadArticleImage", () => {
    test("should upload image", async () => {
        const fakeImage = path.resolve(__dirname, __filename);
        const result = {
            secure_url: "123",
            public_id: "456",
        } as UploadApiResponse;

        mockedCloudinary.uploader.upload = jest.fn(() => {
            return Promise.resolve(result);
        });

        const response = await request(app as App)
            .post("/api/article/upload")
            .attach("image", fakeImage);
        expect(response.status).toBe(200);
        expect(
            (response.body as { image: { src: string; img_id: string } }).image
                .src,
        ).toStrictEqual(result.secure_url);
    });
});

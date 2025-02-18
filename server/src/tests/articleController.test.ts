//need to import this after middleware mock
jest.mock("../middleware/isAuthenticated", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        req.session = {} as Session;
        req.session.user = {
            _id: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f45"),
            name: "fake user",
        } as TUser;
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
jest.mock("../middleware/checkCsrf", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    })
);

import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import type { NextFunction, Request, Response } from "express";
import { Session } from "express-session";
import path from "path";
import request from "supertest";
import app from "../app";
import authorizePermissions from "../middleware/authorizePermissions";
import isAuthenticated from "../middleware/isAuthenticated";
import Article from "../models/Article";
import { User as TUser } from "../models/User";
import * as dbHandler from "./db";
import mongoose from "mongoose";

jest.mock("cloudinary");
jest.mock("../db/redis");
const mockedCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

//spin fake mongodb server before each
beforeAll(async () => {
    await dbHandler.connect();
});

beforeEach(() => {
    mockedCloudinary.uploader.destroy = jest.fn();
});

afterEach(async () => {
    (mockedCloudinary.uploader.destroy as any).mockReset();
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

const articleData = [
    {
        title: "unsanitized content",
        content:
            "hello darkness, my old friend!<script><div>test</div<</script>",
        category: "projects",
        code_languages: [],
        tags: ["javascript"],
        source_link: undefined,
        demo_link: undefined,
        image: "test.jpg",
        img_id: "5dbff32e367a343830cd2f42",
        userId: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f45"),
        slug: "project 1",
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
        userId: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f46"),
        slug: "blog 1",
    },
    {
        title: "failed to create",
        content: "123",
        category: "blog",
        code_languages: [],
        tags: ["typescript", "jsx"],
        source_link: undefined,
        demo_link: undefined,
        image: "test.jpg",
        img_id: "5dbff32e367a343830cd2f42",
        userId: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f46"),
        slug: "blog 2",
    },
    {
        title: "updated article",
        content: "12312312312312313123 asdasdasd",
        category: "projects",
        code_languages: [],
        tags: ["javascript"],
        source_link: "http://test.com/src",
        demo_link: "http://test.com/demo",
        image: "updated.jpg",
        img_id: "5dbff32e367a343830cd2f40",
        userId: new mongoose.Types.ObjectId("5dbff32e367a343830cd2f45"),
        slug: "project 2",
    },
];

describe("getAllArticles", () => {
    test("no projects found", async () => {
        const response = await request(app).get("/api/article/projects");

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
            .put(`/api/article/${createdArticle._id.toString()}`)
            .send(articleData[3]);

        const result = await Article.findOne({ title: "updated article" });
        //check if different img id's
        expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
        expect(response.body.article.title).toStrictEqual(result!.title);
        expect(response.status).toBe(200);
    });
    test("should fail and not call cloudinary while updating article using same image", async () => {
        const createdArticle = await Article.create(articleData[0]);
        const response = await request(app)
            .put(`/api/article/${createdArticle._id.toString()}`)
            .send(articleData[2]);
        //should not call destroy
        expect(mockedCloudinary.uploader.destroy).toHaveBeenCalledTimes(0);
        expect(response.status).toBe(400);
    });
});

describe("deleteArticle", () => {
    test("should delete article", async () => {
        const createdArticle = await Article.create(articleData[0]);
        const deletedId = createdArticle._id.toString();

        const response = await request(app).delete(`/api/article/${deletedId}`);
        expect(response.status).toBe(200);
        expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(1);
        expect(response.body.msg).toStrictEqual("Success! Article is removed");
    });
});

describe("uploadArticleImage", () => {
    test("should upload image", async () => {
        const fakeImage = path.resolve(__dirname, __filename); //faked current file as image
        const result = {
            secure_url: "123",
            public_id: "456",
        } as UploadApiResponse;

        mockedCloudinary.uploader.upload = jest.fn(() => {
            return Promise.resolve(result);
        });

        const response = await request(app)
            .post("/api/article/upload")
            .attach("image", fakeImage);
        expect(response.status).toBe(200);
        expect(response.body.image.src).toStrictEqual(result.secure_url);
    });
});

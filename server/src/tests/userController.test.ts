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
jest.mock("../middleware/checkCsrf", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    })
);

import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import * as dbHandler from "./db";

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

describe("banUser", () => {
    test("should successfully ban user", async () => {
        const user = await User.create(fakeUser);

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

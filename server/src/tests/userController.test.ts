jest.mock("../middleware/isAuthenticated", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
);
jest.mock("../middleware/authorizePermissions", () =>
    jest.fn(() => {
        return (req: Request, res: Response, next: NextFunction): void => {
            next();
        };
    }),
);
jest.mock("../middleware/checkCsrf", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
);

import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import type { App } from "supertest/types.js";
import app from "../app.js";
import User from "../models/User.js";
import * as dbHandler from "./db.js";

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

        const response = await request(app as App).delete(
            `/api/user/${user._id.toString()}`,
        );
        expect((response.body as { msg: string }).msg).toStrictEqual(
            "User was banned",
        );
        const another = await request(app as App).delete(
            `/api/user/${user._id.toString()}`,
        );
        expect((another.body as { msg: string }).msg).toStrictEqual(
            "User was unbanned",
        );
    });
});

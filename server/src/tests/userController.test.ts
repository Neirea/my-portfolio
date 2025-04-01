import type { NextFunction, Request, Response } from "express";
import type { Session } from "express-session";
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
import User, { type User as TUser } from "../models/User.js";
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
    roles: ["admin"],
    avatar_url: "http://some_image",
    isBanned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
};

describe("banUser", () => {
    test("should successfully ban user", async () => {
        const user = await User.create(fakeUser);

        const response = await request(app as App).delete(
            `/api/user/${user._id.toString()}`,
        );
        expect(response.body).toStrictEqual({ msg: "User was banned" });
        const another = await request(app as App).delete(
            `/api/user/${user._id.toString()}`,
        );
        expect(another.body).toStrictEqual({ msg: "User was unbanned" });
    });
});

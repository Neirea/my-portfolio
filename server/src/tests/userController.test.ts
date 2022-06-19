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

describe("updateUser", () => {
	test("should successfully update user", async () => {
		const user = await User.create(fakeUser);

		const newUser = {
			_id: user._id.toString(),
			name: "new name",
			roles: user.roles,
			avatar_url: user.avatar_url,
		};

		const response = await request(app)
			.patch(`/api/user/${user._id.toString()}`)
			.send(newUser);
		expect(response.status).toBe(200);
		expect(response.body.user.name).toStrictEqual("new name");
	});
});

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

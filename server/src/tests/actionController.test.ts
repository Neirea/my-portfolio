import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import type { App } from "supertest/types.js";
import { describe, expect, test, vi, type Mock } from "vitest";
import app from "../app.js";
import sendEmail from "../utils/sendEmail.js";

vi.mock("../utils/sendEmail", () => ({ default: vi.fn() }));
const mockedSendEmail = sendEmail as Mock;

vi.mock("../middleware/rateLimit", () => ({
    default: vi.fn(
        () =>
            (req: Request, res: Response, next: NextFunction): void => {
                next();
            },
    ),
}));

const fetchMock = (value: Record<string, any>): Mock =>
    vi
        .fn()
        .mockReturnValueOnce(
            Promise.resolve({ json: () => Promise.resolve(value) }),
        );

describe("testCaptcha", () => {
    test("should be positive response", async () => {
        const googleInput = { token: "123" };
        const googleResponse = {
            riskAnalysis: { score: 1 },
            tokenProperties: { valid: true },
        };

        global.fetch = fetchMock(googleResponse);
        const response = await request(app as App)
            .post("/api/action/testCaptcha")
            .send(googleInput);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toStrictEqual(
            expect.stringContaining("json"),
        );
    });
    test("should be bad recaptcha token response", async () => {
        const dataInput = { token: "123" };
        const googleResponse = {
            tokenProperties: { valid: false },
        };

        global.fetch = fetchMock(googleResponse);
        const response = await request(app as App)
            .post("/api/action/testCaptcha")
            .send(dataInput);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({ msg: "Bad recaptcha token" });
    });
    test("should be negative response", async () => {
        const dataInput = { token: "123" };
        const googleResponse = {
            riskAnalysis: { score: 0.49 },
            tokenProperties: { valid: true },
        };

        global.fetch = fetchMock(googleResponse);

        const response = await request(app as App)
            .post("/api/action/testCaptcha")
            .send(dataInput);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({ msg: "Can't fool us, bot!" });
    });
    test("should return 400 if reCAPTCHA token is missing", async () => {
        const response = await request(app as App)
            .post("/api/action/testCaptcha")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({ msg: "Missing reCAPTCHA token" });
    });
    test("should return 503 if reCAPTCHA server is unavailable", async () => {
        const googleInput = { token: "123" };

        global.fetch = vi.fn().mockRejectedValueOnce(new Error("Server error"));

        const response = await request(app as App)
            .post("/api/action/testCaptcha")
            .send(googleInput);

        expect(response.status).toBe(503);
        expect(response.body).toStrictEqual({
            msg: "Failed to verify reCAPTCHA",
        });
    });
});

describe("sendContactMessage", () => {
    test("should send email with banned html tag(img)", async () => {
        const dataInput = {
            msg: "<img><p>123<b>456</b></p></img>",
            subject: "sender@gmail.com",
        };
        const emailRes = {
            statusCode: 201,
            body: dataInput,
            headers: "kek",
        };

        mockedSendEmail.mockReturnValueOnce([emailRes, {}]);

        const response = await request(app as App)
            .post("/api/action/sendContactMessage")
            .send(dataInput);

        expect(response.body).toStrictEqual({
            userText: "<p>123<b>456</b></p>",
            msg: "Message was successfully sent",
        });
        expect(response.status).toBe(201);
    });
    test("should return 400 if message contains only banned HTML tags", async () => {
        const dataInput = {
            msg: "<img src='test.jpg'>",
            subject: "sender@gmail.com",
        };

        const response = await request(app as App)
            .post("/api/action/sendContactMessage")
            .send(dataInput);

        expect(response.status).toBe(400);
        expect(response.body).toStrictEqual({
            msg: "Message content is invalid",
        });
    });
    test("should return 503 if email sending fails", async () => {
        const dataInput = {
            msg: "<p>Hello, this is a test message</p>",
            subject: "sender@gmail.com",
        };

        mockedSendEmail.mockRejectedValueOnce(new Error("Email server error"));

        const response = await request(app as App)
            .post("/api/action/sendContactMessage")
            .send(dataInput);

        expect(response.status).toBe(503);
        expect(response.body).toStrictEqual({ msg: "Failed to send an email" });
    });
    test("should sanitize HTML content in the message", async () => {
        const dataInput = {
            msg: "<script>alert('XSS')</script><p>Valid content</p>",
            subject: "sender@gmail.com",
        };

        mockedSendEmail.mockResolvedValueOnce({});

        const response = await request(app as App)
            .post("/api/action/sendContactMessage")
            .send(dataInput);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({
            userText: "<p>Valid content</p>",
            msg: "Message was successfully sent",
        });
    });
});

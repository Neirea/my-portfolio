import request from "supertest";
import type { App } from "supertest/types.js";
import { describe, expect, test, vi, type Mock } from "vitest";
import app from "../app.js";
import sendEmail from "../utils/sendEmail.js";

vi.mock("../utils/sendEmail", () => ({ default: vi.fn() }));
const mockedSendEmail = sendEmail as Mock;

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
        expect(response.headers["content-type"]).toEqual(
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
        expect((response.body as { msg: string }).msg).toBe(
            "Bad recaptcha token",
        );
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
        expect((response.body as { msg: string }).msg).toBe(
            "Can't fool us, bot!",
        );
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

        expect((response.body as { userText: string }).userText).toEqual(
            "<p>123<b>456</b></p>",
        );
        expect((response.body as { msg: string }).msg).toEqual(
            "Message was successfully sent",
        );
        expect(response.status).toBe(201);
    });
});

import axios from "axios";
import request from "supertest";
import app from "../app";
import "../utils/sendEmail";

jest.mock("axios");
jest.mock("../utils/sendEmail", () => jest.fn());

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("testCaptcha", () => {
    test("should be positive response", async () => {
        const googleInput = { token: "123" };
        const googleResponse = {
            data: {
                riskAnalysis: { score: 1 },
                tokenProperties: { valid: true },
            },
        };

        mockedAxios.post.mockReturnValueOnce(Promise.resolve(googleResponse));
        const response = await request(app)
            .post("/api/action/testCaptcha")
            .send({ googleInput });

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });
    test("should be bad recaptcha token response", async () => {
        const dataInput = { token: "123" };
        const googleResponse = {
            data: {
                tokenProperties: { valid: false },
            },
        };

        mockedAxios.post.mockReturnValueOnce(Promise.resolve(googleResponse));
        const response = await request(app)
            .post("/api/action/testCaptcha")
            .send({ dataInput });

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Bad recaptcha token");
    });
    test("should be negative response", async () => {
        const dataInput = { token: "123" };
        const googleResponse = {
            data: {
                riskAnalysis: { score: 0.49 },
                tokenProperties: { valid: true },
            },
        };

        mockedAxios.post.mockReturnValueOnce(Promise.resolve(googleResponse));
        const response = await request(app)
            .post("/api/action/testCaptcha")
            .send({ dataInput });

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Can't fool us, bot!");
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

        jest.mock("../utils/sendEmail", () =>
            jest.fn().mockReturnValueOnce(Promise.resolve([emailRes, {}]))
        );

        const response = await request(app)
            .post("/api/action/sendContactMessage")
            .send(dataInput);

        expect(response.body.userText).toEqual("<p>123<b>456</b></p>");
        expect(response.body.msg).toEqual("Message was successfully sent");
        expect(response.status).toBe(201);
    });
});

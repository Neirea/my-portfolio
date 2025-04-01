import type { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import CustomError from "../errors/index.js";
import { StatusCodes } from "../utils/httpStatusCodes.js";
import sendEmail from "../utils/sendEmail.js";
import { appConfig } from "../utils/appConfig.js";

const validateRecaptcha = async (token: string | null): Promise<number> => {
    if (!token) {
        throw new CustomError.BadRequestError("Missing reCAPTCHA token");
    }

    const recaptchaURL = `https://recaptchaenterprise.googleapis.com/v1/projects/${appConfig.recaptchaProjectName}/assessments?key=${appConfig.recaptchaAPIKey}`;
    const body = {
        event: {
            token: token,
            siteKey: appConfig.recaptchaSecretKey,
            expectedAction: "contact_email",
        },
    };

    type TRecaptchaResponse = {
        tokenProperties: {
            valid: boolean;
        };
        riskAnalysis?: {
            score?: number;
        };
    };

    let response: TRecaptchaResponse;
    try {
        response = (await (
            await fetch(recaptchaURL, {
                body: JSON.stringify(body),
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
        ).json()) as TRecaptchaResponse;
    } catch (error) {
        console.error(error);
        throw new CustomError.ServiceUnavailableError(
            "Failed to verify reCAPTCHA",
        );
    }
    if (!response) {
        throw new CustomError.ServiceUnavailableError(
            "Couldn't login to google captcha servers",
        );
    }
    if (response.tokenProperties.valid === false) {
        throw new CustomError.BadRequestError("Bad recaptcha token");
    }

    return response.riskAnalysis?.score || -1;
};

export interface TestRecaptchaRequest extends Request {
    body: {
        token: string;
    };
}

export const testRecaptcha = async (
    req: TestRecaptchaRequest,
    res: Response,
): Promise<void> => {
    const recaptchaScore = await validateRecaptcha(req.body.token);
    if (recaptchaScore < 0.5) {
        throw new CustomError.BadRequestError("Can't fool us, bot!");
    }
    res.status(StatusCodes.OK).json({ msg: "Success" });
};

interface SendContactMessageRequest extends Request {
    body: {
        subject: string;
        msg: string;
    };
}

export const sendContactMessage = async (
    req: SendContactMessageRequest,
    res: Response,
): Promise<void> => {
    const { subject, msg } = req.body;
    const cleanHtml = sanitizeHtml(msg);

    if (cleanHtml === "") {
        throw new CustomError.BadRequestError("Message content is invalid");
    }

    try {
        await sendEmail({
            to: appConfig.contactEmail,
            subject,
            html: cleanHtml,
        });
        res.status(StatusCodes.CREATED).json({
            msg: "Message was successfully sent",
            userText: cleanHtml,
        });
    } catch (error) {
        console.error(error);
        throw new CustomError.ServiceUnavailableError(
            "Failed to send an email",
        );
    }
};

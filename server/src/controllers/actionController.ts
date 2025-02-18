import type { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import CustomError from "../errors";
import sendEmail from "../utils/sendEmail";
import { StatusCodes } from "../utils/http-status-codes";

/* RECAPTCHA */
const validateRecaptcha = async (token: string | null) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const apiKey = process.env.RECAPTCHA_API_KEY;
    const projectName = process.env.RECAPTCHA_PROJECT_ID;

    if (!token) {
        throw new CustomError.BadRequestError("Missing reCAPTCHA token");
    }

    const recaptchaURL = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectName}/assessments?key=${apiKey}`;
    const body = {
        event: {
            token: token,
            siteKey: secretKey,
            expectedAction: "contact_email",
        },
    };
    let response;
    try {
        response = await (
            await fetch(recaptchaURL, {
                body: JSON.stringify(body),
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
        ).json();
    } catch (error) {
        console.error(error);
        throw new CustomError.ServiceUnavailableError(
            "Failed to verify reCAPTCHA"
        );
    }
    if (!response) {
        throw new CustomError.ServiceUnavailableError(
            "Couldn't login to google captcha servers"
        );
    }
    if (response.tokenProperties.valid === false) {
        throw new CustomError.BadRequestError("Bad recaptcha token");
    }

    return response.riskAnalysis.score || -1;
};

export const testRecaptcha = async (req: Request, res: Response) => {
    const recaptchaScore = await validateRecaptcha(req.body.token);
    if (recaptchaScore < 0.5) {
        throw new CustomError.BadRequestError("Can't fool us, bot!");
    }
    res.status(StatusCodes.OK).json({ msg: "Success" });
};

/* send contact message on email */
export const sendContactMessage = async (req: Request, res: Response) => {
    const { subject, msg }: { subject: string; msg: string } = req.body;
    const cleanHtml = sanitizeHtml(msg);

    try {
        await sendEmail({
            to: process.env.CONTACT_EMAIL,
            subject,
            html: cleanHtml,
        });
        res.status(StatusCodes.CREATED).json({
            msg: "Message was successfully sent",
            userText: cleanHtml,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Failed to send an email",
        });
    }
};

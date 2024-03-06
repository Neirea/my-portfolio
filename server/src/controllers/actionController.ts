import axios from "axios";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sanitizeHtml from "sanitize-html";
import CustomError from "../errors";
import sendEmail from "../utils/sendEmail";

interface validateResponseData {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    score: number;
    error_codes?: string[];
}

/* RECAPTCHA */
const validateRecaptcha = async (token: string | null) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post<validateResponseData>(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
    if (!response) {
        throw new CustomError.ServiceUnavailableError(
            "Couldn't login to google captcha servers"
        );
    }
    if (!response.data.success) {
        throw new CustomError.BadRequestError("Bad recaptcha token");
    }

    return response.data.score;
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
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Failed to send an email",
        });
    }
};

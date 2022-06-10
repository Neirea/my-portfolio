import { Request, Response } from "express";
import sendEmail from "../utils/sendEmail";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import sanitizeHtml from "sanitize-html";
import CustomError from "../errors";

/* RECAPTCHA */
const validateRecaptcha = async (token: string | null) => {
	interface validateResponseData {
		success: boolean;
		challenge_ts: string;
		hostname: string;
	}
	const secret = process.env.RECAPTCHA_SECRET_KEY;
	const response = await axios.post<validateResponseData>(
		`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
	);
	if (!response) {
		throw new CustomError.ServiceUnavailableError(
			"Couldn't login to google captcha servers"
		);
	}

	return response.data.success;
};

export const testRecaptcha = async (req: Request, res: Response) => {
	const isHuman = await validateRecaptcha(req.body.token);
	if (!isHuman) {
		throw new CustomError.BadRequestError("Can't fool us, bot!");
	}
	res.status(StatusCodes.OK).json({ msg: "Success" });
};

/* send contact message on email */
export const sendContactMessage = async (req: Request, res: Response) => {
	const { subject, msg }: { subject: string; msg: string } = req.body;
	const cleanHtml = sanitizeHtml(msg);
	const result = await sendEmail({
		to: process.env.CONTACT_URL,
		subject,
		html: cleanHtml,
	});

	if (!result) {
		throw new CustomError.BadRequestError("Failed to send an email");
	}
	res
		.status(StatusCodes.CREATED)
		.json({ msg: "Message was successfully sent", userText: cleanHtml });
};

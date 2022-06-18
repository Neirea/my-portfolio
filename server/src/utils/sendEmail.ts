import sgMail from "@sendgrid/mail";
import CustomError from "../errors";

interface sendEmailProps {
	to: string | undefined;
	subject: string;
	html: string;
}

const sendEmail = async ({ to, subject, html }: sendEmailProps) => {
	if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_EMAIL) {
		throw new CustomError.BadRequestError("Failed to send an email");
	}

	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const info = await sgMail.send({
		to,
		from: process.env.SENDGRID_EMAIL,
		subject,
		html,
	});
	return info;
};

export default sendEmail;

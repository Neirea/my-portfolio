import sgMail from "@sendgrid/mail";

interface sendEmailProps {
	to: string | undefined;
	subject: string;
	html: string;
}

const sendEmail = async ({ to, subject, html }: sendEmailProps) => {
	if (
		process.env.SENDGRID_API_KEY === undefined ||
		process.env.SENDGRID_EMAIL === undefined
	)
		throw new Error(); //specify error
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

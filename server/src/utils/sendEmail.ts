import CustomError from "../errors";
import mailer from "nodemailer";

interface sendEmailProps {
    to: string | undefined;
    subject: string;
    html: string;
}

const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT!,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, html }: sendEmailProps) => {
    transporter.verify((error) => {
        console.log(error);
        if (error) {
            throw new CustomError.BadRequestError("Failed to send an email");
        }
    });

    const info = await transporter.sendMail({
        to,
        from: process.env.EMAIL_USER,
        subject,
        html,
    });
    return info;
};

export default sendEmail;

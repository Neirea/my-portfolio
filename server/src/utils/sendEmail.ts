import mailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

type SendEmailProps = {
    to: string | undefined;
    subject: string;
    html: string;
};

const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT!,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async ({
    to,
    subject,
    html,
}: SendEmailProps): Promise<SMTPTransport.SentMessageInfo> => {
    const info = await transporter.sendMail({
        to,
        from: process.env.EMAIL_USER,
        subject,
        html,
    });
    return info;
};

export default sendEmail;

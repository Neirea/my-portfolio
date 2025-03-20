import mailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { appConfig } from "./appConfig.js";

type SendEmailProps = {
    to: string | undefined;
    subject: string;
    html: string;
};

const transporter = mailer.createTransport({
    host: appConfig.emailHost,
    port: appConfig.emailPort,
    secure: true,
    auth: {
        user: appConfig.emailUser,
        pass: appConfig.emailPassword,
    },
});

const sendEmail = async ({
    to,
    subject,
    html,
}: SendEmailProps): Promise<SMTPTransport.SentMessageInfo> => {
    const info = await transporter.sendMail({
        to,
        from: appConfig.emailUser,
        subject,
        html,
    });
    return info;
};

export default sendEmail;

export const appConfig = {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT) || 8080,
    cloudinaryName: process.env.CLDNRY_NAME,
    cloudinaryAPIKey: process.env.CLDNRY_API_KEY,
    cloudinaryAPISecret: process.env.CLDNRY_API_SECRET,
    mongoUrl: process.env.MONGO_URL,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    recaptchaAPIKey: process.env.RECAPTCHA_API_KEY,
    recaptchaProjectName: process.env.RECAPTCHA_PROJECT_ID,
    emailHost: process.env.EMAIL_HOST,
    emailPort: Number(process.env.EMAIL_PORT),
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    contactEmail: process.env.CONTACT_EMAIL,
    clientUrl:
        process.env.NODE_ENV !== "production"
            ? "http://localhost:5173"
            : "https://www.neirea.com",
    domain: process.env.NODE_ENV === "production" ? "neirea.com" : undefined,
};

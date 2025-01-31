import { recaptchaKey } from "./data";

export async function getRecaptchaToken(action: string) {
    const recaptcha = (window as any).grecaptcha.enterprise;
    return new Promise((resolve) => {
        recaptcha.ready(async () => {
            try {
                const token: string = await recaptcha.execute(recaptchaKey, {
                    action,
                });
                resolve(token);
            } catch (error) {
                resolve("");
            }
        });
    });
}

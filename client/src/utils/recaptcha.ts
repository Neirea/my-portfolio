import { recaptchaKey } from "./data";

export const getRecaptchaToken = async (action: string): Promise<string> => {
    const recaptcha = window.grecaptcha?.enterprise;
    return new Promise((resolve, reject) => {
        recaptcha?.ready(() => {
            void recaptcha
                .execute(recaptchaKey, {
                    action,
                })
                .then((token) => resolve(token))
                .catch((e: Error) => reject(e));
        });
    });
};

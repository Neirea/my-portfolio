import axios from "axios";
import type { CustomAxiosError } from "../types/app.type";

export const getErrorMessage = (
    error: unknown,
    defaultMessage: string,
): string => {
    let errorMessage: string | undefined;
    if (axios.isAxiosError(error)) {
        errorMessage = (error as CustomAxiosError).response?.data?.msg;
    }
    return errorMessage || defaultMessage;
};

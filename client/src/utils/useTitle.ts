import { useEffect } from "react";

export const useTitle = (newTitle: string | undefined): void => {
    useEffect(() => {
        if (!newTitle) return;
        const title = document.querySelector("title");
        if (title) {
            title.textContent = newTitle + " | Neirea";
        }
        return (): void => {
            if (title) {
                title.textContent = "Neirea";
            }
        };
    }, [newTitle]);
};

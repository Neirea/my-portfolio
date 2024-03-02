import { useEffect } from "react";

export const useTitle = (newTitle: string | undefined) => {
    useEffect(() => {
        if (!newTitle) return;
        const title = document.querySelector("title");
        if (title) {
            title.textContent = newTitle + " | Neirea";
        }
        return () => {
            if (title) {
                title.textContent = "Neirea";
            }
        };
    }, [newTitle]);
};

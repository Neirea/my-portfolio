import {
    type Dispatch,
    type RefObject,
    type SetStateAction,
    useEffect,
} from "react";

export const useOutsideClick = (
    ref: RefObject<HTMLElement | null>,
    set: Dispatch<SetStateAction<any>>,
): void => {
    useEffect(() => {
        const controller = new AbortController();
        document.addEventListener(
            "click",
            (e: MouseEvent) => {
                if (ref.current && !ref.current.contains(e.target as Node)) {
                    set(false);
                }
            },
            { signal: controller.signal },
        );
        return (): void => {
            controller.abort();
        };
    }, [ref, set]);
};

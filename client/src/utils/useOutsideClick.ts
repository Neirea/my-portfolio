import {
    type Dispatch,
    type MutableRefObject,
    type SetStateAction,
    useEffect,
} from "react";

export const useOutsideClick = (
    ref: MutableRefObject<HTMLElement | null>,
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

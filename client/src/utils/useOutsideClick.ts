import {
    type Dispatch,
    type MutableRefObject,
    type SetStateAction,
    useEffect,
} from "react";

/* Hook that sets state to false on click outside of the passed ref */
export const useOutsideClick = (
    ref: MutableRefObject<any>,
    set: Dispatch<SetStateAction<any>>
) => {
    useEffect(() => {
        const controller = new AbortController();
        document.addEventListener(
            "click",
            (e: MouseEvent) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    set(false);
                }
            },
            { signal: controller.signal }
        );
        return () => {
            controller.abort();
        };
    }, [ref, set]);
};

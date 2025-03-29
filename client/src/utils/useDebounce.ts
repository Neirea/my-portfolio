import { useEffect, useState } from "react";

export const useDebounce = <T>(computeValue: () => T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(computeValue());
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(computeValue());
        }, delay);

        return (): void => {
            clearTimeout(handler);
        };
    }, [computeValue, delay]);
    return debouncedValue;
};

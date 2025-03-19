import { useMemo } from "react";
import { useLocation } from "react-router";

export const useSearchParams = (): URLSearchParams => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

import { useEffect, type JSX } from "react";
import { useLocation } from "react-router";

const ScrollToTop = (): JSX.Element => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <></>;
};

export default ScrollToTop;

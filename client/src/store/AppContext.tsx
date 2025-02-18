import axios, { AxiosHeaders } from "axios";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { mainBgDarkColor, mainBgLightColor } from "../styles/theme";
import type { AppContextValues } from "../types/app.type";
import type { User } from "../types/abac.type";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const osDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode =
        localStorage.getItem("darkMode") === "1" ||
        (!("darkMode" in localStorage) && osDarkMode ? true : false);
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [userLoading, setUserLoading] = useState(true);

    //fetch only once on load
    useQuery(
        ["user"],
        () =>
            axios
                .get<{ user: User; csrfToken: string }>("/api/user/showMe")
                .then((res) => res.data),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (!data) return;
                setUser(data.user);
                axios.interceptors.request.use(function (config) {
                    type CustomHeaders = AxiosHeaders & {
                        "csrf-token": string;
                    };
                    (config.headers as CustomHeaders)["csrf-token"] =
                        data.csrfToken;

                    return config;
                });
            },
            onSettled() {
                setUserLoading(false);
            },
        }
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode ? "1" : "0");
        document.body.style.background = darkMode
            ? mainBgDarkColor
            : mainBgLightColor;
    }, [darkMode]);

    const logoutUser = async () => {
        try {
            await axios.delete("/api/auth/logout");
            setUser(undefined);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                userLoading,
                setUser,
                user,
                logoutUser,
                darkMode,
                toggleDarkMode,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

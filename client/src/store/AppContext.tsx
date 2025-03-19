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

export const AppProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const osDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode =
        localStorage.getItem("darkMode") === "1" ||
        (!("darkMode" in localStorage) && osDarkMode ? true : false);
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [user, setUser] = useState<User | undefined>(undefined);

    const { data, isFetched } = useQuery({
        queryKey: ["user"],
        queryFn: () =>
            axios
                .get<{ user: User; csrfToken: string }>("/api/user/showMe")
                .then((res) => res.data),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data) {
            setUser(data.user);
            axios.interceptors.request.use((config) => {
                type CustomHeaders = AxiosHeaders & {
                    "csrf-token": string;
                };
                if (data.csrfToken) {
                    (config.headers as CustomHeaders)["csrf-token"] =
                        data.csrfToken;
                }

                return config;
            });
        }
    }, [data]);

    const toggleDarkMode = (): void => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode ? "1" : "0");
        document.body.style.background = darkMode
            ? mainBgDarkColor
            : mainBgLightColor;
    }, [darkMode]);

    const logoutUser = async (): Promise<void> => {
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
                userLoading: !isFetched,
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

export const useGlobalContext = (): AppContextValues => {
    return useContext(AppContext);
};

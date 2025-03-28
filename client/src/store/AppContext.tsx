import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosHeaders } from "axios";
import {
    createContext,
    type JSX,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { mainBgDarkColor, mainBgLightColor } from "../styles/theme";
import type { User } from "../types/abac.type";
import type { AppContextValues } from "../types/app.type";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const queryClient = useQueryClient();
    const osDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode =
        localStorage.getItem("darkMode") === "1" ||
        (!("darkMode" in localStorage) && osDarkMode ? true : false);
    const [darkMode, setDarkMode] = useState(isDarkMode);

    const { data, isFetched } = useQuery({
        queryKey: ["user"],
        queryFn: () =>
            axios
                .get<{ user: User; csrfToken: string }>("/api/user/showMe")
                .then((res) => res.data),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data?.csrfToken) {
            axios.interceptors.request.use((config) => {
                type CustomHeaders = AxiosHeaders & {
                    "csrf-token": string;
                };
                (config.headers as CustomHeaders)["csrf-token"] =
                    data.csrfToken;

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
            await queryClient.invalidateQueries({ queryKey: ["user"] });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                userLoading: !isFetched,
                user: data?.user,
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

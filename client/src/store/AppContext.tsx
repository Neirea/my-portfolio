import axios, { AxiosHeaders } from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { mainBgDarkColor, mainBgLightColor } from "../styles/theme";
import type { AppContextValues, IUser } from "../types/appTypes";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const isDarkMode = localStorage.getItem("darkMode") === "0" ? false : true;
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [user, setUser] = useState<IUser | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    //fetch only once on load
    useQuery(
        ["user"],
        () =>
            axios
                .get<{ user: IUser; csrfToken: string }>("/api/user/showMe")
                .then((res) => res.data),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (!data) return;
                setUser(data.user);
                axios.interceptors.request.use(function (config) {
                    interface CustomHeaders extends AxiosHeaders {
                        "csrf-token": string;
                    }
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
            setUser(null);
        } catch (error) {
            console.log(error);
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

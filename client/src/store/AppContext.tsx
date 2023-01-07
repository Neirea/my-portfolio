import axios, { AxiosHeaders } from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useQuery } from "react-query";
import { mainBgDarkColor, mainBgLightColor } from "../styles/theme";
import type { AppContextValues, IUser } from "../types/appTypes";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const isDarkMode =
        localStorage.getItem("darkMode") === "on" ||
        (localStorage.getItem("darkMode") === null &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? true
            : false;
    const [darkMode, setDarkMode] = useState(isDarkMode);
    const [user, setUser] = useState<IUser | null>(null);

    //fetch only once on load
    const { isLoading } = useQuery(
        ["user"],
        () =>
            axios
                .get<{ user: IUser; csrfToken: string }>("/api/user/showMe")
                .then((res) => res.data),
        {
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
        }
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode ? "on" : "off");
        // override index.html style
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
                isLoading,
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

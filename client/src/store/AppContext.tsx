import {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
import axios from "axios";
import { handleError } from "../utils/handleError";
import { IUser, AppContextValues } from "../types/appTypes";
import { mainBgLightColor, mainBgDarkColor } from "../styles/theme";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const isDarkMode =
		localStorage.getItem("darkMode") === "on" ||
		(localStorage.getItem("darkMode") === null &&
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches)
			? true
			: false;
	const [isLoading, setIsLoading] = useState(true);
	const [darkMode, setDarkMode] = useState(isDarkMode);
	const [user, setUser] = useState<IUser | null>(null);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const fetchUser = async () => {
		try {
			const { data } = await axios.get<{ user: IUser }>("/api/user/showMe");
			if (data) setUser(data.user);
		} catch (error) {
			handleError(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

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

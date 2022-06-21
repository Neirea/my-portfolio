import {
	useContext,
	useState,
	useEffect,
	createContext,
	ReactNode,
} from "react";
import axios from "axios";
import type { IUser, AppContextValues } from "../types/appTypes";
import { mainBgLightColor, mainBgDarkColor } from "../styles/theme";
import { useQuery } from "react-query";

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
			axios.get<{ user: IUser }>("/api/user/showMe").then((res) => res.data),
		{
			onSuccess: (data) => {
				if (!data) return;
				setUser(data.user);
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

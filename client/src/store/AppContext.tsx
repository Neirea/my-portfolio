import { useContext, useState, useEffect, createContext } from "react";
import axios from "axios";
import { IUser, AppContextValues } from "../types/appTypes";

export const AppContext = createContext({} as AppContextValues);

export const AppProvider = ({ children }: any) => {
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
			const { data } = await axios.get("/api/user/showMe");
			if (data) setUser(data.user);
		} catch (error) {
			// handleError(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		localStorage.setItem("darkMode", darkMode ? "on" : "off");
	}, [darkMode]);

	const logoutUser = async () => {
		try {
			await axios.delete("/api/auth/logout");
			setUser(null);
		} catch (error) {}
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

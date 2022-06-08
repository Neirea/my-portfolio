import React, {
	useContext,
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
} from "react";
import axios from "axios";

export enum userRoles {
	admin = "admin",
	user = "user",
}

interface UserSchema {
	platform_name: string;
	platform_type: string;
	name: string;
	roles: userRoles[];
	avatar_url: string;
	isBanned: boolean;
}

interface AppContextValues {
	darkMode: boolean;
	isLoading: boolean;
	user: UserSchema | null;
	setUser: Dispatch<SetStateAction<UserSchema | null>>;
	logoutUser: () => void;
	toggleDarkMode: () => void;
}

export const AppContext = React.createContext({} as AppContextValues);

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
	const [user, setUser] = useState<UserSchema | null>(null);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const fetchUser = async () => {
		try {
			const { data } = await axios.get("/api/v1/user/showMe");
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
			await axios.delete("/api/v1/auth/logout");
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

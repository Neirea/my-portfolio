import { Dispatch, SetStateAction } from "react";

export enum userRoles {
	admin = "admin",
	user = "user",
}

export interface IUser {
	_id: number;
	platform_name: string;
	platform_type: string;
	name: string;
	roles: userRoles[];
	avatar_url: string;
	isBanned: boolean;
}

export interface AppContextValues {
	darkMode: boolean;
	isLoading: boolean;
	user: IUser | null;
	setUser: Dispatch<SetStateAction<IUser | null>>;
	logoutUser: () => void;
	toggleDarkMode: () => void;
}

export interface IAlert {
	show: boolean;
	text: string;
	type: string;
}
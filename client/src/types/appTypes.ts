import type { Dispatch, SetStateAction } from "react";

export enum userRoles {
	admin = "admin",
	user = "user",
}

export interface IUser {
	platform_id: number;
	platform_name: string;
	platfrom_type: string;
	name: string;
	roles: userRoles[];
	avatar_url: string;
	isBanned: boolean;
	_id: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
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

export interface LocationState {
	from?: Location;
	tag?: string;
}

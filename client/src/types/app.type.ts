import type { Dispatch, SetStateAction } from "react";

export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];

export type User = {
    platform_id: number;
    platform_name: string;
    platfrom_type: string;
    name: string;
    roles: Role[];
    avatar_url: string;
    isBanned: boolean;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

export type AppContextValues = {
    darkMode: boolean;
    userLoading: boolean;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    logoutUser: () => void;
    toggleDarkMode: () => void;
};

export type Alert = {
    show: boolean;
    text: string;
    type: string;
};

export type LocationState = {
    from?: Location;
    tag?: string;
};

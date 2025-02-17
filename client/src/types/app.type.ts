import type { Dispatch, SetStateAction } from "react";
import type { User } from "./abac.type";

export type AppContextValues = {
    darkMode: boolean;
    userLoading: boolean;
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
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

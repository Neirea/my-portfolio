import type { JSX } from "react";
import type { Article, Comment } from "./article.type";

export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];

export type User = {
    platform_id: number;
    platform_name: string;
    platform_type: string;
    name: string;
    roles: Role[];
    avatar_url: string;
    isBanned: boolean;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

export type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

export type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
        }>;
    }>;
};

export type Permissions = {
    articles: {
        dataType: Article;
        action: "create" | "read" | "update" | "delete";
    };
    comments: {
        dataType: Comment;
        action: "create" | "read" | "update" | "delete" | "deleteCascade";
    };
    users: {
        dataType: User;
        action: "read" | "delete";
    };
};

export type ProtectedRoute = {
    path: string;
    resource: keyof Permissions;
    action: Permissions[keyof Permissions]["action"];
    component: JSX.Element;
};

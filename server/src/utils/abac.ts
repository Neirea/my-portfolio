import { Role, User } from "../models/User";

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
        dataType: { id: string };
        action: "create" | "read" | "update" | "delete";
    };
    comments: {
        dataType: { id: string; authorId: string };
        action: "create" | "read" | "update" | "delete" | "deleteCascade";
    };
    users: {
        dataType: { id: string };
        action: "read" | "delete";
    };
};

const ROLES = {
    admin: {
        articles: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        comments: {
            create: true,
            read: true,
            update: true,
            delete: true,
            deleteCascade: true,
        },
        users: {
            read: true,
            delete: (user, data) => user._id.toString() !== data.id,
        },
    },
    user: {
        articles: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
        comments: {
            create: (user) => !user.isBanned,
            read: true,
            update: (user, data) =>
                user._id.toString() === data.authorId && !user.isBanned,
            delete: (user, data) =>
                user._id.toString() === data.authorId && !user.isBanned,
            deleteCascade: false,
        },
        users: { read: false, delete: false },
    },
} as const as RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
    user: User | undefined,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    if (user == null) return false;

    return user.roles.some((role) => {
        const permission = ROLES[role][resource]?.[action];
        if (permission == null) return false;

        if (typeof permission === "boolean") return permission;
        return data != null && permission(user, data);
    });
}

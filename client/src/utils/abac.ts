import type {
    Permissions,
    RolesWithPermissions,
    User,
} from "../types/abac.type";

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
            delete: (user, data) =>
                user._id !== data._id && !data.roles.includes("admin"),
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
            update: (user, data) => user._id === data.user.id && !user.isBanned,
            delete: (user, data) => user._id === data.user.id && !user.isBanned,
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

import mongoose, { model, Schema } from "mongoose";

export const MongoPlatforms = ["google", "github"] as const;

export const MongoUserRoles = ["admin", "user"] as const;

export type Platform = (typeof MongoPlatforms)[number];
export type Role = (typeof MongoUserRoles)[number];

export type User = {
    platform_id: number;
    platform_name: string;
    platform_type: Platform;
    name: string;
    roles: Role[];
    avatar_url: string;
    isBanned: boolean;
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

const UserSchema = new Schema(
    {
        platform_id: {
            type: Number,
            required: true,
        },
        platform_name: {
            type: String,
            required: true,
        },
        platform_type: {
            type: String,
            enum: MongoPlatforms,
        },
        name: {
            type: String,
            required: true,
        },
        roles: [
            {
                type: String,
                enum: MongoUserRoles,
                default: "user",
            },
        ],
        avatar_url: {
            type: String,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default model<User>("User", UserSchema);

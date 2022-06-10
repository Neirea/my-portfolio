import { Schema, model } from "mongoose";

export enum platformEnum {
	github = "github",
	google = "google",
}

export enum userRoles {
	admin = "admin",
	user = "user",
}

export interface IUser {
	platform_name: string;
	platfrom_type: platformEnum;
	name: string;
	roles: userRoles[];
	avatar_url: string;
	isBanned: boolean;
	_id: number;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

/* mb need more fields */
const UserSchema = new Schema(
	{
		platform_name: {
			type: String,
			required: true,
		},
		platform_type: {
			type: String,
			enum: Object.values(platformEnum),
		},
		name: {
			type: String,
			required: true,
		},
		roles: [
			{
				type: String,
				enum: Object.values(userRoles),
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

export default model<IUser>("User", UserSchema);

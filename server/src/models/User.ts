import { Schema, model } from "mongoose";
import { userRoles } from "../config";

enum platformEnum {
	github = "github",
	google = "google",
}

export interface IUser {
	platform_name: string;
	platfrom_type: platformEnum;
	message: string;
	replies: number[];
	user: {
		id: number;
		name?: string;
		isBanned?: boolean;
	};
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

export default model("User", UserSchema);

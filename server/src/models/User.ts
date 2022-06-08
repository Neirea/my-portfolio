import { Schema, model } from "mongoose";

const roles = ["admin", "user"];

/* mb need more fields */
const UserSchema = new Schema(
	{
		platform_name: {
			type: String,
			required: true,
		},
		platform_type: {
			type: String,
			enum: ["github", "google"],
		},
		name: {
			type: String,
			required: true,
		},
		roles: [
			{
				type: String,
				enum: roles,
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

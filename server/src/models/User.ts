import { Schema, model } from "mongoose";

/* mb need more fields */
const UserSchema = new Schema({
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
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
	avatar_url: {
		type: String,
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
});

export default model("User", UserSchema);

import { Schema, model } from "mongoose";

/* mb need more fields */
const UserSchema = new Schema({
	github_id: {
		type: String,
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

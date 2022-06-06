import { Schema, model } from "mongoose";

/* mb need more fields */
const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please provide name"],
		minlength: 3,
		maxlength: 20,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
});

export default model("User", UserSchema);

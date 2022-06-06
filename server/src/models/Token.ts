import { Types, Schema, model } from "mongoose";

const TokenSchema = new Schema(
	{
		refreshToken: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		// device used to access
		userAgent: {
			type: String,
			required: true,
		},
		isValid: {
			type: Boolean,
			default: true,
		},
		remember: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Token", TokenSchema);

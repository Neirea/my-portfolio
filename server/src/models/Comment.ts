import mongoose, { Schema, model, Types, Query } from "mongoose";

interface Comment {
	article: Types.ObjectId;
	parent: Types.ObjectId;
	message: string;
	replies: [Types.ObjectId];
	user: {
		id: Types.ObjectId;
		name: string;
		isBanned: boolean;
	};
}

function isMessageRequired(this: Comment) {
	return typeof this.message === "string" ? false : true;
}
const CommentSchema = new Schema(
	{
		article: {
			type: Types.ObjectId,
			ref: "Article",
			required: true,
		},
		parent: {
			type: Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		message: {
			type: String,
			required: isMessageRequired,
		},
		replies: [
			{
				type: Types.ObjectId,
				ref: "Comment",
			},
		],
		user: {
			id: {
				type: Types.ObjectId,
				ref: "User",
				required: true,
			},
			name: { type: String },
			isBanned: { type: Boolean },
		},
	},
	{ timestamps: true }
);

//middleware to populate replies of top level comments in recursive way
function autoPopulateReplies(this: Query<Comment, Comment>) {
	this.populate("replies");
}
CommentSchema.pre<Query<Comment, Comment>>("find", autoPopulateReplies).pre(
	"findOne",
	autoPopulateReplies
);

export default model("Comment", CommentSchema);

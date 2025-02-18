import { model, Query, Schema, Types } from "mongoose";

export type Comment = {
    articleId: Types.ObjectId;
    parentId: Types.ObjectId | null;
    message: string;
    replies: Comment[];
    user: {
        id: Types.ObjectId;
        name: string;
        avatar: string;
    };
    _id: Types.ObjectId;
    createdAt: Date;
    editedAt: Date;
};

function isMessageRequired(this: Comment) {
    return typeof this.message === "string" ? false : true;
}
const CommentSchema = new Schema(
    {
        articleId: {
            type: Types.ObjectId,
            ref: "Article",
            required: true,
        },
        parentId: {
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
            avatar: { type: String },
        },
    },
    { timestamps: true }
);

function autoPopulateReplies(this: Query<Comment, Comment>) {
    this.populate("replies");
}
CommentSchema.pre<Query<Comment, Comment>>("find", autoPopulateReplies).pre(
    "findOne",
    autoPopulateReplies
);

export default model<Comment>("Comment", CommentSchema);

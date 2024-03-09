import { model, Schema, Types } from "mongoose";

export interface IArticle {
    title: string;
    content: string;
    category: string;
    code_languages: string[];
    source_link: string | undefined;
    demo_link: string | undefined;
    tags: string[];
    image: string;
    img_id: string;
    userId: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

const ArticleSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide article name"],
            maxlength: [100, "Name can not be more than 100 characters"],
        },
        content: {
            type: String,
            required: [true, "Please provide content of an article"],
            minlength: [10, "Content can not be less than 10 characters"],
        },
        category: {
            type: String,
            required: [true, "Please provide category"],
            enum: ["blog", "projects"],
        },
        code_languages: { type: [{ type: String }], default: [] },
        source_link: {
            type: String,
        },
        demo_link: {
            type: String,
        },
        tags: { type: [{ type: String }], default: [] },
        image: {
            type: String,
            required: [true, "Please provide main image"],
        },
        img_id: {
            type: String,
            required: [true, "Please provide image public_id"],
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<IArticle>("Article", ArticleSchema);

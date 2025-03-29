import { model, Schema, Types } from "mongoose";

export type Article = {
    title: string;
    slug: string;
    content: string;
    html: string;
    category: "blog" | "project";
    source_link: string | undefined;
    demo_link: string | undefined;
    tags: string[];
    image: string;
    img_id: string;
    userId: Types.ObjectId;
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

export type UpsertArticle = {
    title: string;
    slug: string;
    category: "blog" | "project";
    demo_link: string;
    source_link: string;
    content: string;
    html: string;
    image: string;
    img_id: string;
    tags: string[];
};

const ArticleSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide article name"],
            maxlength: [100, "Title can not be more than 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            required: [true, "Please provide article slug"],
            maxlength: [100, "Slug can not be more than 100 characters"],
        },
        content: {
            type: String,
            required: [true, "Please provide content of an article"],
            minlength: [10, "Content can not be less than 10 characters"],
        },
        html: {
            type: String,
            required: [true, "Please provide html content of an article"],
            minlength: [10, "HTML can not be less than 10 characters"],
        },
        category: {
            type: String,
            required: [true, "Please provide category"],
            enum: ["blog", "projects"],
        },
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
    },
);

export default model<Article>("Article", ArticleSchema);

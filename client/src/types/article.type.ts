export type ACTIONS = "reply" | "edit" | "none";

export const CATEGORIES = ["blog", "projects"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Article = {
    title: string;
    slug: string;
    content: string;
    html: string;
    category: Category;
    source_link: string;
    demo_link: string;
    tags: string[];
    image: string;
    img_id: string;
    userId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type Comment = {
    articleId: string;
    parentId: string;
    message: string;
    replies: Comment[];
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    _id: string;
    createdAt: string;
    editedAt: string;
};

export type CommentJsx = {
    level: number;
    comment: Comment;
    parentComment: Comment | null;
};

export type ArticleData = {
    title: string;
    slug: string;
    category: string;
    _id: string;
};

export type CommentState = {
    type: ACTIONS;
    id: string | null;
};
export type CommentError = {
    index: number | undefined;
    msg: string;
};

export type UploadedImageResponse = {
    image: { src: string; img_id: string };
};

export type ArticleEditor = {
    title: string;
    slug: string;
    category: Category;
    demo_link: string;
    source_link: string;
    content: string;
    html: string;
    image: string;
    img_id: string;
};

export interface ArticleCreated extends ArticleEditor {
    tags: string[];
}

export interface ArticleUpdated extends ArticleCreated {
    userId: string;
}

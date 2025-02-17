export type ACTIONS = "reply" | "edit" | "none";

export const CATEGORIES = ["blog", "projects"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Article = {
    title: string;
    slug: string;
    content: string;
    category: Category;
    code_languages: string[];
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
    content?: string;
    image?: string;
    img_id?: string;
};

export type ArticleCreated = ArticleEditor & {
    tags: string[];
};

export type ArticleUpdated = ArticleEditor & {
    userId: string;
    tags: string[];
};

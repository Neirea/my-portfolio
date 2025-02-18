import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Comment, CommentJsx } from "../../../types/article.type";

export const parseComments = (comments: Comment[]): CommentJsx[] => {
    const result: CommentJsx[] = [];

    const parse = (
        comments: Comment[],
        parentComment: Comment | null = null,
        depth = 0
    ) => {
        for (const comment of comments) {
            result.push({
                level: depth,
                comment,
                parentComment,
            });
            parse(comment.replies, comment, depth + 1);
        }
    };

    parse(comments);
    return result;
};

export default function useComments(articleId: string | undefined) {
    return useQuery(
        ["comments", articleId],
        () =>
            axios
                .get<{ comments: Comment[] }>(`/api/comment/${articleId}`)
                .then((res) => res.data.comments),
        {
            select: (comments) => parseComments(comments),
        }
    );
}

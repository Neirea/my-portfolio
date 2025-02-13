import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { IComment, IJsxComment } from "../../../types/article.type";

export const parseComments = (comments: IComment[]): IJsxComment[] => {
    const result: IJsxComment[] = [];

    const parse = (comments: IComment[], depth = 0) => {
        for (const comment of comments) {
            result.push({ level: depth, comment });
            parse(comment.replies, depth + 1);
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
                .get<{ comments: IComment[] }>(`/api/comment/${articleId}`)
                .then((res) => res.data.comments),
        {
            select: (comments) => parseComments(comments),
        }
    );
}

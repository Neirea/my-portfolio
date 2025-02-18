import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "../../../types/article.type";
import useCommentsContext from "./useCommentsContext";

export default function useUpdateComment() {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation(
        ({
            commentId,
            msg,
            authorId,
            index,
        }: {
            commentId: string;
            msg: string;
            authorId: string;
            index: number;
        }) =>
            axios.patch<{ comment: Comment }>(
                `/api/comment/${articleId}/${commentId}?authorId=${authorId}`,
                { message: msg }
            ),
        {
            onSuccess() {
                resetCommentState();
                queryClient.invalidateQueries(["comments", articleId]);
            },
            onError(error: any, { index }) {
                const errorMessage =
                    error.response?.data?.msg || "There was some error";
                setCommentError({ index: index, msg: errorMessage });
            },
        }
    );
}

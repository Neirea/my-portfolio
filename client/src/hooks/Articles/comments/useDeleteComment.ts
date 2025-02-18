import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCommentsContext from "./useCommentsContext";

export default function useDeleteComment() {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation(
        ({
            commentId,
            authorId,
        }: {
            commentId: string;
            authorId: string;
            index: number;
        }) =>
            axios.delete(
                `/api/comment/${articleId}/${commentId}?authorId=${authorId}`
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

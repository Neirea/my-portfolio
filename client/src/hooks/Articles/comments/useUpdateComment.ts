import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IComment } from "../../../types/articleTypes";
import useCommentsContext from "./useCommentsContext";

export default function useUpdateComment() {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation(
        ({
            commentId,
            msg,
            index,
        }: {
            commentId: string;
            msg: string;
            index: number;
        }) =>
            axios.patch<{ comment: IComment }>(
                `/api/comment/${articleId}/${commentId}`,
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

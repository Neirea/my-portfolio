import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "../../../types/article.type";
import useCommentsContext from "./useCommentsContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const useUpdateComment = () => {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation(
        ({
            commentId,
            msg,
            authorId,
        }: {
            commentId: string;
            msg: string;
            authorId: string;
            index: number;
        }) =>
            axios.patch<{ comment: Comment }>(
                `/api/comment/${articleId}/${commentId}?authorId=${authorId}`,
                { message: msg },
            ),
        {
            onSuccess() {
                resetCommentState();
                void queryClient.invalidateQueries(["comments", articleId]);
            },
            onError(error: any, { index }) {
                const errorMessage = getErrorMessage(
                    error,
                    "There was some error",
                );
                setCommentError({ index: index, msg: errorMessage });
            },
        },
    );
};

export default useUpdateComment;

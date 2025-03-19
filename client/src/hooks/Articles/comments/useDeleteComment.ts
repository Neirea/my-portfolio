import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import useCommentsContext from "./useCommentsContext";

const useDeleteComment = () => {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation({
        mutationFn: ({
            commentId,
            authorId,
        }: {
            commentId: string;
            authorId: string;
            index: number;
        }) =>
            axios.delete<void>(
                `/api/comment/${articleId}/${commentId}?authorId=${authorId}`,
            ),
        onSuccess() {
            resetCommentState();

            void queryClient.invalidateQueries({
                queryKey: ["comments", articleId],
            });
        },
        onError(error, { index }) {
            const errorMessage = getErrorMessage(error, "There was some error");
            setCommentError({ index: index, msg: errorMessage });
        },
    });
};

export default useDeleteComment;

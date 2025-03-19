import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCommentsContext from "./useCommentsContext";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const useDeleteCommentCascade = () => {
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
            axios.delete(
                `/api/comment/${articleId}/d_all/${commentId}?authorId=${authorId}`,
            ),
        onSuccess() {
            resetCommentState();
            void queryClient.invalidateQueries({
                queryKey: ["comments", articleId],
            });
        },
        onError(error: any, { index }) {
            const errorMessage = getErrorMessage(error, "There was some error");
            setCommentError({ index: index, msg: errorMessage });
        },
    });
};

export default useDeleteCommentCascade;

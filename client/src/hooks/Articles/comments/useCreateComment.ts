import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "../../../types/article.type";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import useCommentsContext from "./useCommentsContext";

type SubmitComment = {
    message: string;
    parentId: string | null;
};

const useCreateComment = () => {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation({
        mutationFn: ({
            submitData,
        }: {
            submitData: SubmitComment;
            index?: number;
        }) =>
            axios
                .post<{
                    comment: Comment;
                }>(`/api/comment/${articleId}`, submitData)
                .then((res) => res.data.comment),
        async onSuccess(newData, { submitData, index }) {
            resetCommentState();

            const oldData = queryClient.getQueryData<Comment[]>([
                "comments",
                articleId,
            ]);

            if (!oldData) return;

            await queryClient.invalidateQueries({
                queryKey: ["comments", articleId],
            });

            const repliedTo = oldData.find(
                (item) => item._id === submitData.parentId,
            );
            if (index !== undefined) {
                repliedTo?.replies.push(newData);
            } else {
                queryClient.setQueriesData<Comment[]>(
                    {
                        queryKey: ["comments", articleId],
                    },
                    [newData, ...oldData],
                );
            }
        },
        onError(error, { index }) {
            const errorMessage = getErrorMessage(error, "There was some error");
            setCommentError({ index: index, msg: errorMessage });
        },
    });
};

export default useCreateComment;

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "../../../types/article.type";
import useCommentsContext from "./useCommentsContext";

type SubmitComment = {
    message: string;
    parentId: string | null;
};

export default function useCreateComment() {
    const queryClient = useQueryClient();
    const { articleId, setCommentError, resetCommentState } =
        useCommentsContext();

    return useMutation(
        ({ submitData }: { submitData: SubmitComment; index?: number }) =>
            axios
                .post<{ comment: Comment }>(
                    `/api/comment/${articleId}`,
                    submitData
                )
                .then((res) => res.data.comment),
        {
            onSuccess(newData, { submitData, index }) {
                resetCommentState();
                queryClient.invalidateQueries(["comments", articleId]);

                const oldData = queryClient.getQueryData<Comment[]>([
                    "comments",
                    articleId,
                ]);

                if (!oldData) return;

                const repliedTo = oldData.find(
                    (item) => item._id === submitData.parentId
                );
                if (index !== undefined) {
                    repliedTo?.replies.push(newData);
                } else {
                    queryClient.setQueriesData<Comment[]>(
                        ["comments", articleId],
                        [newData, ...oldData]
                    );
                }
            },
            onError(error: any, { index }) {
                const errorMessage =
                    error.response?.data?.msg || "There was some error";
                setCommentError({ index: index, msg: errorMessage });
            },
        }
    );
}

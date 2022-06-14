import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useCommentsContext from "./useCommentsContext";

export default function useDeleteComment(index: number) {
	const queryClient = useQueryClient();
	const { articleId, setCommentError, resetCommentState } =
		useCommentsContext();
	return useMutation(
		(commentId: string) =>
			axios.delete(`/api/comment/${articleId}/${commentId}`),
		{
			onSuccess() {
				resetCommentState();
			},
			onError(error: any, commentId) {
				const errorMessage =
					error.response?.data?.msg || "There was some error";
				setCommentError({ index: index, msg: errorMessage });
			},
			onSettled() {
				queryClient.invalidateQueries(["comments", articleId]);
			},
		}
	);
}

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useCommentsContext from "./useCommentsContext";

export default function useDeleteComment() {
	const queryClient = useQueryClient();
	const { articleId, setCommentError, resetCommentState } =
		useCommentsContext();

	return useMutation(
		({ commentId, index }: { commentId: string; index: number }) =>
			axios.delete(`/api/comment/${articleId}/${commentId}`),
		{
			onSuccess() {
				resetCommentState();

				queryClient.invalidateQueries(["comments", articleId], {
					refetchInactive: true,
				});
			},
			onError(error: any, { index }) {
				const errorMessage =
					error.response?.data?.msg || "There was some error";
				setCommentError({ index: index, msg: errorMessage });
			},
		}
	);
}

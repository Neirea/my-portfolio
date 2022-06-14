import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useCommentsContext from "./useCommentsContext";
import { IComment } from "../../../types/articleTypes";

export default function useUpdateComment(index: number) {
	const queryClient = useQueryClient();
	const { articleId, setCommentError, resetCommentState } =
		useCommentsContext();
	return useMutation(
		({ commentId, msg }: { commentId: string; msg: string }) =>
			axios.patch<{ comment: IComment }>(
				`api/comment/${articleId}/${commentId}`,
				{ message: msg }
			),
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

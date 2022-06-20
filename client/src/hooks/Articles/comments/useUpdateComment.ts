import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useCommentsContext from "./useCommentsContext";
import type { IComment } from "../../../types/articleTypes";

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

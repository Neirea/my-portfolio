import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IComment } from "../../../types/articleTypes";
import useCommentsContext from "./useCommentsContext";

interface ISubmitComment {
	userId: string;
	message: string;
	parentId: string | null;
}

export default function useCreateComment(index?: number) {
	const queryClient = useQueryClient();
	const { articleId, setCommentError, resetCommentState } =
		useCommentsContext();
	return useMutation(
		(submitData: ISubmitComment) =>
			axios.post<{ comment: IComment }>(
				`/api/comment/${articleId}`,
				submitData
			),
		{
			onSuccess() {
				resetCommentState();
			},
			onError(error: any) {
				const errorMessage =
					error.response?.data?.msg || "There was some error";
				setCommentError({ index: index, msg: errorMessage });
			},
			onSettled() {
				console.log(articleId);

				queryClient.invalidateQueries(["comments", articleId]);
			},
		}
	);
}

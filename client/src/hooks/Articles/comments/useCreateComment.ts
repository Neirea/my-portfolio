import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IComment } from "../../../types/articleTypes";
import useCommentsContext from "./useCommentsContext";

interface ISubmitComment {
	userId: string;
	message: string;
	parentId: string | null;
}

export default function useCreateComment() {
	const queryClient = useQueryClient();
	const { articleId, setCommentError, resetCommentState } =
		useCommentsContext();

	return useMutation(
		({ submitData, index }: { submitData: ISubmitComment; index?: number }) =>
			axios
				.post<{ comment: IComment }>(`/api/comment/${articleId}`, submitData)
				.then((res) => res.data.comment),
		{
			onSuccess(newComment) {
				resetCommentState();

				const oldData = queryClient.getQueryData<{ comments: IComment[] }>([
					"comments",
					articleId,
				]);
				oldData?.comments.unshift(newComment);

				queryClient.invalidateQueries(["comments", articleId], {
					refetchInactive: true,
				});
			},
			onError(error: any, { index }) {
				console.log(error);

				const errorMessage =
					error.response?.data?.msg || "There was some error";
				setCommentError({ index: index, msg: errorMessage });
			},
		}
	);
}

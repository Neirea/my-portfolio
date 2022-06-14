import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useCommentsContext from "./Articles/comments/useCommentsContext";

export default function useBanUser() {
	const queryClient = useQueryClient();
	const { articleId } = useCommentsContext();

	return useMutation((userId: string) => axios.delete(`/api/user/${userId}`), {
		onSuccess() {
			queryClient.invalidateQueries(["comments", articleId], {
				refetchInactive: true,
			});
		},
	});
}

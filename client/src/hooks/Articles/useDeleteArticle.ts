import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export default function useDeleteArticle() {
	const queryClient = useQueryClient();

	return useMutation(
		(vars: { articleId: string; type: string }) =>
			axios.delete(`/api/article/${vars.articleId}`),
		{
			onSuccess(data, vars) {
				queryClient.invalidateQueries(["articles", vars.type], {
					refetchInactive: true,
				});
			},
		}
	);
}

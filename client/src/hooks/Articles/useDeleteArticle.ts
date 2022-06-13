import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IArticle } from "../../types/articleTypes";

export default function useDeleteArticle() {
	const queryClient = useQueryClient();
	const localDeleteArticle = (articleId: string, type: string) => {
		let items = queryClient.getQueryData<IArticle[]>([type])!;
		//find index of deleted article in a list
		const articleIndex = items
			.map((elem) => {
				return elem._id;
			})
			.indexOf(articleId);
		items.splice(articleIndex, 1);
		return items;
	};

	return useMutation(
		(vars: { articleId: string; type: string }) =>
			axios.delete(`/api/article/${vars.articleId}`),
		{
			onSuccess(data, vars) {
				let items = localDeleteArticle(vars.articleId, vars.type);
				if (items.length === 0) {
					queryClient.invalidateQueries([vars.type]);
				} else {
					queryClient.setQueryData([vars.type], { articles: items });
				}
			},
		}
	);
}

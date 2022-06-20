import axios from "axios";
import { useQuery } from "react-query";
import type { IComment, IJsxComment } from "../../../types/articleTypes";

export const parseComments = async (
	comments: IComment[],
	depth: number,
	array: IJsxComment[]
) => {
	for (let i = 0; i < comments?.length; i++) {
		if (!i) depth++;
		const response = { level: depth, comment: comments[i] };
		array.push(response);
		parseComments(comments[i].replies, depth, array);
	}
};

export default function useComments(articleId: string | undefined) {
	return useQuery(
		["comments", articleId],
		() =>
			axios
				.get<{ comments: IComment[] }>(`/api/comment/${articleId}`)
				.then((res) => res.data.comments),
		{
			select: (comments) => {
				const commentsArray: IJsxComment[] = [];
				//make styled code in content
				parseComments(comments, -1, commentsArray);

				return commentsArray;
			},
		}
	);
}

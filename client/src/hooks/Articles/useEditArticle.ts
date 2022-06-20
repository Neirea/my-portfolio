import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import type {
	IArticle,
	IUploadedImageResponse,
	IArticleValues,
} from "../../types/articleTypes";

interface ICreatedArticle extends IArticleValues {
	tags: string[];
}

export default function useEditArticle() {
	const queryClient = useQueryClient();
	const editArticle = useMutation(
		({
			articleId,
			newArticle,
		}: {
			articleId: string | undefined;
			newArticle: ICreatedArticle;
		}) =>
			axios
				.patch<{ article: IArticle }>(`/api/article/${articleId}`, newArticle)
				.then((res) => res.data.article),
		{
			onSuccess(newArticle) {
				queryClient.invalidateQueries(["articles", newArticle.category], {
					refetchInactive: true,
				});
			},
		}
	);
	return useMutation(
		async ({
			articleId,
			selectedImage,
			newArticle,
		}: {
			articleId: string | undefined;
			selectedImage: File | undefined;
			newArticle: ICreatedArticle;
		}) => {
			if (!selectedImage) {
				editArticle.mutate({ articleId, newArticle });
				return editArticle.data;
			} else {
				const data = new FormData();
				data.append("image", selectedImage);
				return axios
					.post<IUploadedImageResponse>("/api/article/upload", data)
					.then((res) => {
						newArticle.image = res.data.image.src;
						newArticle.img_id = res.data.image.img_id;
						editArticle.mutate({ articleId, newArticle });
						return editArticle.data;
					});
			}
		},
		{
			onError(error: any) {
				error.msg = error.response?.data?.msg || "There was some error";
			},
		}
	);
}

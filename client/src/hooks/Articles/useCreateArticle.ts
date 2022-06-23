import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import type {
	IArticle,
	IArticleValues,
	IUploadedImageResponse,
} from "../../types/articleTypes";

interface ICreatedArticle extends IArticleValues {
	tags: string[];
}

export default function useCreateArticle() {
	const queryClient = useQueryClient();
	const createArticle = useMutation(
		(newArticle: ICreatedArticle) =>
			axios
				.post<{ article: IArticle }>("/api/article/", newArticle)
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
			selectedImage,
			newArticle,
		}: {
			selectedImage: File | undefined;
			newArticle: ICreatedArticle;
		}) => {
			if (!selectedImage) throw new Error("Missing image");
			const data = new FormData();
			data.append("image", selectedImage);
			return axios
				.post<IUploadedImageResponse>("/api/article/upload", data)
				.then((res) => {
					newArticle.image = res.data.image.src;
					newArticle.img_id = res.data.image.img_id;
					createArticle.mutate(newArticle);
				});
		},

		{
			onError(error: any) {
				error.message = error.response?.data?.msg || "There was some error";
			},
		}
	);
}

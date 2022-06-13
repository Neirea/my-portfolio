import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IArticle, IUploadedImageResponse } from "../../types/articleTypes";

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

// const onSubmit = async (editorHTML: string) => {
// 	try {
// 		hideAlert();
// 		if (!selectedImage) {
// 			showAlert({ text: "Please provide image" });
// 			return;
// 		}
// 		setLoading(true);

// 		const articleTags = tags.split(" ");

// 		const data = new FormData();
// 		data.append("image", selectedImage);

// 		//upload  image to server
// 		const response = await axios.post<IUploadedImageResponse>(
// 			"/api/article/upload",
// 			data
// 		);

// 		//to avoid setArticleValues between 2 depending await's
// 		const createdArticle = {
// 			...articleValues,
// 			tags: articleTags,
// 			content: editorHTML,
// 			image: response.data.image.src,
// 			img_id: response.data.image.img_id,
// 			userId: user!._id,
// 			code_languages: languageDetector(editorHTML),
// 		};
// 		await axios.post("/api/article/", createdArticle);

// 		setSuccess(true);
// 		showAlert({
// 			text: `article successfuly created!`,
// 			type: "success",
// 		});
// 	} catch (error) {
// 		handleError(error, navigate);
// 		showAlert({ text: error?.response?.data?.msg || "there was an error" });
// 	} finally {
// 		setLoading(false);
// 	}
// };

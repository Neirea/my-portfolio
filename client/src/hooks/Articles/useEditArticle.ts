import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    Article,
    ArticleUpdated,
    UploadedImageResponse,
} from "../../types/article.type";

export default function useEditArticle() {
    const queryClient = useQueryClient();
    const editArticle = useMutation(
        ({
            articleId,
            newArticle,
        }: {
            articleId: string | undefined;
            newArticle: ArticleUpdated;
        }) =>
            axios
                .put<{ article: Article }>(
                    `/api/article/${articleId}`,
                    newArticle
                )
                .then((res) => res.data.article),
        {
            onSuccess(newArticle) {
                queryClient.invalidateQueries([
                    "articles",
                    newArticle.category,
                ]);
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
            newArticle: ArticleUpdated;
        }) => {
            if (!selectedImage) {
                editArticle.mutate({ articleId, newArticle });
                return editArticle.data;
            } else {
                const data = new FormData();
                data.append("image", selectedImage);
                const imageResponse = await axios.post<UploadedImageResponse>(
                    "/api/article/upload",
                    data
                );
                newArticle.image = imageResponse.data.image.src;
                newArticle.img_id = imageResponse.data.image.img_id;
                return editArticle.mutateAsync({ articleId, newArticle });
            }
        },
        {
            onError(error: any) {
                error.msg = error.response?.data?.msg || "There was some error";
            },
        }
    );
}

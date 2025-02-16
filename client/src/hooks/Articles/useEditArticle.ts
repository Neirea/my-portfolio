import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    Article,
    ArticleCreated,
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
            newArticle: ArticleCreated;
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
            newArticle: ArticleCreated;
        }) => {
            if (!selectedImage) {
                editArticle.mutate({ articleId, newArticle });
                return editArticle.data;
            } else {
                const data = new FormData();
                data.append("image", selectedImage);
                return axios
                    .post<UploadedImageResponse>("/api/article/upload", data)
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

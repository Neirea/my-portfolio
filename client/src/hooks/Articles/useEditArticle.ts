import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    Article,
    ArticleUpdated,
    UploadedImageResponse,
} from "../../types/article.type";
import { getErrorMessage } from "../../utils/getErrorMessage";

const useEditArticle = () => {
    const queryClient = useQueryClient();
    const editArticle = useMutation({
        mutationFn: ({
            articleId,
            newArticle,
        }: {
            articleId: string | undefined;
            newArticle: ArticleUpdated;
        }) =>
            axios.put<{
                article: Article;
            }>(`/api/article/${articleId}`, newArticle),
        onSuccess(res) {
            void queryClient.invalidateQueries({
                queryKey: ["articles", res.data.article.category],
            });
        },
    });
    return useMutation({
        mutationFn: async ({
            articleId,
            selectedImage,
            newArticle,
        }: {
            articleId: string | undefined;
            selectedImage: File | undefined;
            newArticle: ArticleUpdated;
        }) => {
            if (!selectedImage) {
                const { data } = await editArticle.mutateAsync({
                    articleId,
                    newArticle,
                });
                return data;
            } else {
                const data = new FormData();
                data.append("image", selectedImage);
                const imageResponse = await axios.post<UploadedImageResponse>(
                    "/api/article/upload",
                    data,
                );
                newArticle.image = imageResponse.data.image.src;
                newArticle.img_id = imageResponse.data.image.img_id;
                return editArticle.mutateAsync({ articleId, newArticle });
            }
        },
        onError(error) {
            error.message = getErrorMessage(error, "There was some error");
        },
    });
};

export default useEditArticle;

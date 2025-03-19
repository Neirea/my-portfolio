import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    Article,
    ArticleCreated,
    UploadedImageResponse,
} from "../../types/article.type";
import { getErrorMessage } from "../../utils/getErrorMessage";

const useCreateArticle = () => {
    const queryClient = useQueryClient();
    const createArticle = useMutation(
        (newArticle: ArticleCreated) =>
            axios
                .post<{ article: Article }>("/api/article/", newArticle)
                .then((res) => res.data.article),
        {
            onSuccess(newArticle) {
                void queryClient.invalidateQueries([
                    "articles",
                    newArticle.category,
                ]);
            },
        },
    );
    return useMutation(
        async ({
            selectedImage,
            newArticle,
        }: {
            selectedImage: File | undefined;
            newArticle: ArticleCreated;
        }) => {
            if (!selectedImage) throw new Error("Missing image");
            const data = new FormData();
            data.append("image", selectedImage);
            const imageResponse = await axios.post<UploadedImageResponse>(
                "/api/article/upload",
                data,
            );

            newArticle.image = imageResponse.data.image.src;
            newArticle.img_id = imageResponse.data.image.img_id;
            return createArticle.mutateAsync(newArticle);
        },

        {
            onError(error) {
                (error as Error).message = getErrorMessage(
                    error,
                    "There was some error",
                );
            },
        },
    );
};

export default useCreateArticle;

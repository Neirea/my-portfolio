import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    Article,
    ArticleCreated,
    UploadedImageResponse,
} from "../../types/article.type";

export default function useCreateArticle() {
    const queryClient = useQueryClient();
    const createArticle = useMutation(
        (newArticle: ArticleCreated) =>
            axios
                .post<{ article: Article }>("/api/article/", newArticle)
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
            selectedImage,
            newArticle,
        }: {
            selectedImage: File | undefined;
            newArticle: ArticleCreated;
        }) => {
            if (!selectedImage) throw new Error("Missing image");
            const data = new FormData();
            data.append("image", selectedImage);
            return axios
                .post<UploadedImageResponse>("/api/article/upload", data)
                .then((res) => {
                    newArticle.image = res.data.image.src;
                    newArticle.img_id = res.data.image.img_id;
                    createArticle.mutate(newArticle);
                });
        },

        {
            onError(error: any) {
                error.message =
                    error.response?.data?.msg || "There was some error";
            },
        }
    );
}

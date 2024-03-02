import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { IUploadedImageResponse } from "../../types/article.type";

export default function usePostImage() {
    return useMutation((data: FormData) =>
        axios
            .post<IUploadedImageResponse>("/api/article/upload", data)
            .then((res) => res.data.image)
    );
}

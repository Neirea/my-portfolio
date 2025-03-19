import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { UploadedImageResponse } from "../../types/article.type";

const usePostImage = () => {
    return useMutation((data: FormData) =>
        axios
            .post<UploadedImageResponse>("/api/article/upload", data)
            .then((res) => res.data.image),
    );
};

export default usePostImage;

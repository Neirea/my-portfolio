import { useMutation } from "react-query";
import axios from "axios";
import type { IUploadedImageResponse } from "../../types/articleTypes";

export default function usePostImage() {
	return useMutation((data: FormData) =>
		axios
			.post<IUploadedImageResponse>("/api/article/upload", data)
			.then((res) => res.data.image)
	);
}

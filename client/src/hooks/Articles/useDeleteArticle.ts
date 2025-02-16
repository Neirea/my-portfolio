import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteArticle() {
    const queryClient = useQueryClient();

    return useMutation(
        (vars: { articleId: string; type: string }) =>
            axios.delete(`/api/article/${vars.articleId}`),
        {
            onSuccess(_, vars) {
                queryClient.invalidateQueries(["articles", vars.type]);
            },
        }
    );
}

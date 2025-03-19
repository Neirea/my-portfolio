import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (vars: { articleId: string; type: string }) =>
            axios.delete(`/api/article/${vars.articleId}`),
        {
            onSuccess(_, vars) {
                void queryClient.invalidateQueries(["articles", vars.type]);
            },
        },
    );
};

export default useDeleteArticle;

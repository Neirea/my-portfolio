import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ articleId }: { articleId: string; type: string }) =>
            axios.delete(`/api/article/${articleId}`),
        onSuccess(_, { type }) {
            void queryClient.invalidateQueries({
                queryKey: ["articles", type],
            });
        },
    });
};

export default useDeleteArticle;

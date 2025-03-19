import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useBanUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => axios.delete(`/api/user/${userId}`),
        onSuccess() {
            void queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

export default useBanUser;

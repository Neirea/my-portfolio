import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useBanUser = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (userId: string) => axios.delete(`/api/user/${userId}`),
        {
            onSuccess() {
                void queryClient.invalidateQueries(["users"]);
            },
        },
    );
};

export default useBanUser;

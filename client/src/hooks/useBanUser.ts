import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useBanUser() {
    const queryClient = useQueryClient();

    return useMutation(
        (userId: string) => axios.delete(`/api/user/${userId}`),
        {
            onSuccess() {
                queryClient.invalidateQueries(["users"]);
            },
        }
    );
}

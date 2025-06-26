import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPartner } from "../services/partner-services";

export function useCreatePartner(onSuccessCallback?: () => void) {
    return useMutation({
        mutationFn: createPartner,
        onSuccess: (res) => {
            if (onSuccessCallback) onSuccessCallback(); // Call component-level callback
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}
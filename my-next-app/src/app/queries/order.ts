import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeOrder } from '../services/order-services'

export function usePlaceOrder(onSuccessCallback?: () => void) {

    /* const queryClient = useQueryClient() */
    return useMutation({
        mutationFn: placeOrder,
        onSuccess: (res) => {
            if (onSuccessCallback) onSuccessCallback(); // Call component-level callback
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeOrder, acceptOrder, rejectOrder, markOrderReady, getAllOrders, getOrderById } from '../services/order-services'

export function useGetAllOrders(restaurantId: string, page?: number, limit?: number) {
    return useQuery({
        queryKey: ['orders', { page, limit, restaurantId }],
        queryFn: () => getAllOrders({ restaurantId, page, limit }),
        retry: 3,
        enabled: !!restaurantId,
    })
}

export function getOneOrder(orderId: string | null) {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(orderId as string),
        enabled: !!orderId,
        retry: 3,
    })
}

export function usePlaceOrder(onSuccessCallback?: () => void) {
    return useMutation({
        mutationFn: placeOrder,
        onSuccess: (res) => {
            if (onSuccessCallback) onSuccessCallback();
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}

export function useAcceptOrder() {
    return useMutation({
        mutationFn: acceptOrder,
    })
}

export function useRejectOrder() {
    return useMutation({
        mutationFn: rejectOrder,
    })
}

export function useMarkOrderReady() {
    return useMutation({
        mutationFn: markOrderReady,
    })
}

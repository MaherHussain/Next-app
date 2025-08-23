import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeOrder, acceptOrder, getOrderById, getTodayOrders } from '../services/order-services'
import { useEffect } from "react";

export function usePlaceOrder(onSuccessCallback?: () => void) {

    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: placeOrder,
        onSuccess: (res) => {
            if (onSuccessCallback) {
                onSuccessCallback(); // Call component-level callback
            }

        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            return errorMessage;

        },
    })
}

export function useAcceptOrder() {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: acceptOrder,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["today-orders"] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            return errorMessage

        }
    })
}

export function useGetOrderById(id: string) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrderById(id),
        enabled: !!id, // Only run if id is provided
        refetchOnWindowFocus: true,
        refetchInterval: 10000, // Refetch every 10 seconds
    })
}

export function useGetTodayOrders() {
    return useQuery({
        queryKey: ['today-orders'],
        queryFn: () => getTodayOrders(),
        refetchInterval: 10000, // Refetch every 10 seconds
        refetchOnWindowFocus: true, // Refetch when the window is focused
    })
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemToCart, getOneCart, deleteItemFromCart, type Payload } from "../services/cart-services";
import { CartItem } from "../types";

export function useAddToCart({ cartId }: { cartId: string }) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: Payload) => addItemToCart({ cartId, payload }),
        onSuccess: (res) => {
            if (cartId) {
                queryClient.invalidateQueries({ queryKey: ['cart', cartId] })
            }
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        }
    })
}

export function useGetCartById(cartId: string) {
    return useQuery({
        queryKey: ['cart', cartId],
        queryFn: () => getOneCart(cartId),
        enabled: !!cartId, // Don't run unless cartId is available
    });
}

export function useDeleteItemFromCart(cartId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: CartItem) => deleteItemFromCart(cartId, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] })
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        }
    })
}
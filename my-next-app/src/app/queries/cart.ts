import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemToCart, getOneCart } from "../services/cart-services";
import { Payload } from "../services/cart-services";

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

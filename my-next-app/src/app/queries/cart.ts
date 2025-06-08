import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addItemToCart, getOneCart } from "../services/cart-services";

export function useAddToCart() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addItemToCart,
        onSuccess: (res, variables) => {
            const { cartId } = variables
            if (cartId) {
                queryClient.invalidateQueries({ queryKey: ['cart', cartId] })
            }
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            console.log(errorMessage)
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